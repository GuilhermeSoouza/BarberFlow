const agendamentoModel = require('../models/agendamentoModel');
const atendimentoModel = require('../models/atendimentoModel');
const avaliacaoModel = require('../models/avaliacaoModel');
const clienteModel = require('../models/clienteModel');

async function criar(req, res) {
    try {
        const { agendamentoId } = req.params;
        const { nota, comentario } = req.body;

        if (!nota || nota < 1 || nota > 5) {
            return res.status(400).json({ erro: 'A nota deve ser entre 1 e 5.' });
        }

        const agendamento = await agendamentoModel.buscarPorId(agendamentoId);
        if (!agendamento) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        const cliente = await clienteModel.buscarPorUsuarioId(req.usuario.id);
        if (!cliente || agendamento.cliente_id !== cliente.id) {
            return res.status(403).json({ erro: 'Você não tem permissão para avaliar este agendamento.' });
        }

        if (agendamento.status !== 'concluido') {
            return res.status(400).json({ erro: 'Só é possível avaliar atendimentos concluídos.' });
        }

        const atendimento = await atendimentoModel.buscarPorAgendamentoId(agendamentoId);

        const avaliacaoExistente = await avaliacaoModel.buscarPorAgendamentoId(agendamentoId);
        if (avaliacaoExistente) {
            return res.status(409).json({ erro: 'Este atendimento já foi avaliado.' });
        }

        const id = await avaliacaoModel.criarAvaliacao({
            atendimento_id: atendimento.id,
            nota,
            comentario: comentario || null,
        });

        res.status(201).json({ id, nota, comentario });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Este atendimento já foi avaliado.' });
        }
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { criar };