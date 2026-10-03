const agendamentoModel = require('../models/agendamentoModel');
const clienteModel = require('../models/clienteModel');

async function criar(req, res) {
    try {
        const { barbeiro_id, servico_id, data_hora } = req.body;

        if (!barbeiro_id || !servico_id || !data_hora) {
            return res.status(400).json({ erro: 'Barbeiro, serviço e data/hora são obrigatórios.' });
        }

        const dataAgendamento = new Date(data_hora);
        if (dataAgendamento < new Date()) {
            return res.status(400).json({ erro: 'Não é possível agendar em uma data/hora no passado.' });
        }

        const hora = dataAgendamento.getHours();
        if (hora < 9 || hora >= 18) {
            return res.status(400).json({ erro: 'Horário fora do expediente (9h às 18h).' });
        }

        const cliente = await clienteModel.buscarPorUsuarioId(req.usuario.id);
        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        const temConflito = await agendamentoModel.verificarConflito(barbeiro_id, data_hora);
        if (temConflito) {
            return res.status(409).json({ erro: 'Este horário já está ocupado para este barbeiro.' });
        }

        const id = await agendamentoModel.criarAgendamento({
            cliente_id: cliente.id,
            barbeiro_id,
            servico_id,
            data_hora,
        });

        return res.status(201).json({ id, barbeiro_id, servico_id, data_hora, status: 'confirmado' });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Este horário já está ocupado para este barbeiro.' });
        }
        return res.status(500).json({ erro: erro.message });
    }
}

async function listar(req, res) {
    try {
        const cliente = await clienteModel.buscarPorUsuarioId(req.usuario.id);
        if (!cliente) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }
        const agendamentos = await agendamentoModel.listarPorCliente(cliente.id);
        res.json(agendamentos);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function cancelar(req, res) {
    try {
        const { id } = req.params;

        const agendamento = await agendamentoModel.buscarPorId(id);
        if (!agendamento) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        const cliente = await clienteModel.buscarPorUsuarioId(req.usuario.id);
        if (!cliente || agendamento.cliente_id !== cliente.id) {
            return res.status(403).json({ erro: 'Você não tem permissão para cancelar este agendamento.' });
        }

        if (agendamento.status === 'cancelado') {
            return res.status(400).json({ erro: 'Este agendamento já está cancelado.' });
        }

        await agendamentoModel.cancelar(id);
        return res.json({ mensagem: 'Agendamento cancelado com sucesso.' });
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = { criar, listar, cancelar };