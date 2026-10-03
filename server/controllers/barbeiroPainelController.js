const agendamentoModel = require('../models/agendamentoModel');
const atendimentoModel = require('../models/atendimentoModel');
const barbeiroModel = require('../models/barbeiroModel');
const servicoModel = require('../models/servicoModel');
const pagamentoModel = require('../models/pagamentoModel');

async function agendaDoDia(req, res) {
    try {
        const barbeiro = await barbeiroModel.buscarPorUsuarioId(req.usuario.id);
        if (!barbeiro) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        const data = req.query.data || new Date().toISOString().split('T')[0];
        const agendamentos = await agendamentoModel.listarPorBarbeiroEData(barbeiro.id, data);
        res.json(agendamentos);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function iniciarAtendimento(req, res) {
    try {
        const { agendamentoId } = req.params;

        const agendamento = await agendamentoModel.buscarPorId(agendamentoId);
        if (!agendamento) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        const barbeiro = await barbeiroModel.buscarPorUsuarioId(req.usuario.id);
        if (!barbeiro || agendamento.barbeiro_id !== barbeiro.id) {
            return res.status(403).json({ erro: 'Você não tem permissão sobre este agendamento.' });
        }

        if (agendamento.status !== 'confirmado') {
            return res.status(400).json({ erro: 'Este agendamento não pode ser iniciado.' });
        }

        const atendimentoId = await atendimentoModel.criarAtendimento(agendamentoId);
        await agendamentoModel.atualizarStatus(agendamentoId, 'em_andamento');

        res.status(201).json({ id: atendimentoId, agendamento_id: agendamentoId, status: 'em_andamento' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function finalizarAtendimento(req, res) {
    try {
        const { agendamentoId } = req.params;

        const agendamento = await agendamentoModel.buscarPorId(agendamentoId);
        if (!agendamento) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        const barbeiro = await barbeiroModel.buscarPorUsuarioId(req.usuario.id);
        if (!barbeiro || agendamento.barbeiro_id !== barbeiro.id) {
            return res.status(403).json({ erro: 'Você não tem permissão sobre este agendamento.' });
        }

        if (agendamento.status !== 'em_andamento') {
            return res.status(400).json({ erro: 'Este agendamento não está em andamento.' });
        }

        const atendimento = await atendimentoModel.buscarPorAgendamentoId(agendamentoId);
        await atendimentoModel.finalizar(atendimento.id);
        await agendamentoModel.atualizarStatus(agendamentoId, 'concluido');

        const servico = await servicoModel.buscarPorId(agendamento.servico_id);
        await pagamentoModel.criarPagamento({
            atendimento_id: atendimento.id,
            valor: servico.preco,
        });

        res.json({ mensagem: 'Atendimento finalizado com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function dashboard(req, res) {
    try {
        const barbeiro = await barbeiroModel.buscarPorUsuarioId(req.usuario.id);
        if (!barbeiro) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        const hoje = new Date().toISOString().split('T')[0];
        const contagem = await agendamentoModel.contarPorBarbeiroEData(barbeiro.id, hoje);

        const total = contagem.confirmado + contagem.em_andamento + contagem.concluido;

        res.json({
            clientesHoje: total,
            aguardando: contagem.confirmado,
            emAtendimento: contagem.em_andamento,
            concluidos: contagem.concluido,
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function historico(req, res) {
    try {
        const barbeiro = await barbeiroModel.buscarPorUsuarioId(req.usuario.id);
        if (!barbeiro) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        const historico = await agendamentoModel.listarHistoricoPorBarbeiro(barbeiro.id);
        res.json(historico);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { agendaDoDia, iniciarAtendimento, finalizarAtendimento, dashboard, historico };