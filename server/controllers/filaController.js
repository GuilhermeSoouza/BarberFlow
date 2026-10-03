const filaModel = require('../models/filaModel');
const clienteModel = require('../models/clienteModel');
const barbeiroModel = require('../models/barbeiroModel');

async function entrar(req, res) {
    try {
        const { barbeiro_id, servico_id } = req.body;

        if (!barbeiro_id || !servico_id) {
            return res.status(400).json({ erro: 'Barbeiro e serviço são obrigatórios.' });
        }

        const cliente = await clienteModel.buscarPorUsuarioId(req.usuario.id);
        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        const jaNaFila = await filaModel.jaEstaNaFila(cliente.id, barbeiro_id);
        if (jaNaFila) {
            return res.status(409).json({ erro: 'Você já está na fila deste barbeiro.' });
        }

        const id = await filaModel.entrarNaFila({
            cliente_id: cliente.id,
            barbeiro_id,
            servico_id,
        });

        res.status(201).json({ id, status: 'aguardando' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function minhaPosicao(req, res) {
    try {
        const cliente = await clienteModel.buscarPorUsuarioId(req.usuario.id);
        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        const entrada = await filaModel.buscarFilaDoClienteHoje(cliente.id);
        if (!entrada) {
            return res.json(null);
        }

        const detalhes = await filaModel.buscarPosicao(entrada.id);
        const tempoEstimado = detalhes.posicao * detalhes.duracao_minutos;

        res.json({
            id: detalhes.id,
            status: detalhes.status,
            servico: detalhes.servico,
            posicao: detalhes.posicao + 1,
            tempoEstimado,
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function listarFilaBarbeiro(req, res) {
    try {
        const barbeiro = await barbeiroModel.buscarPorUsuarioId(req.usuario.id);
        if (!barbeiro) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        const fila = await filaModel.listarPorBarbeiro(barbeiro.id);
        res.json(fila);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function chamarProximo(req, res) {
    try {
        const { id } = req.params;
        await filaModel.atualizarStatus(id, 'em_atendimento');
        res.json({ mensagem: 'Cliente chamado.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function concluirFila(req, res) {
    try {
        const { id } = req.params;
        await filaModel.atualizarStatus(id, 'concluido');
        res.json({ mensagem: 'Atendimento da fila concluído.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { entrar, minhaPosicao, listarFilaBarbeiro, chamarProximo, concluirFila };