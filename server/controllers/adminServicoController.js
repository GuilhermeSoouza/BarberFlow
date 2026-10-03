const servicoModel = require('../models/servicoModel');

async function listar(req, res) {
    try {
        const servicos = await servicoModel.listarTodos();
        res.json(servicos);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const { nome, duracao_minutos, preco } = req.body;

        if (!nome || !duracao_minutos || !preco) {
            return res.status(400).json({ erro: 'Nome, duração e preço são obrigatórios.' });
        }

        const servico = await servicoModel.buscarPorId(id);
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' });
        }

        await servicoModel.atualizarServico(id, { nome, duracao_minutos, preco });
        res.json({ mensagem: 'Serviço atualizado com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function remover(req, res) {
    try {
        const { id } = req.params;

        const servico = await servicoModel.buscarPorId(id);
        if (!servico) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' });
        }

        await servicoModel.definirAtivo(id, false);
        res.json({ mensagem: 'Serviço removido com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function reativar(req, res) {
    try {
        const { id } = req.params;
        await servicoModel.definirAtivo(id, true);
        res.json({ mensagem: 'Serviço reativado com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { listar, atualizar, remover, reativar };