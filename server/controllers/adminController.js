const adminModel = require('../models/adminModel');

async function dashboard(req, res) {
    try {
        const { faturamento, totalPagamentos } = await adminModel.faturamentoDoMes();
        const atendimentos = await adminModel.contarAtendimentosDoMes();
        const clientes = await adminModel.contarClientesAtivos();
        const servicosTop = await adminModel.servicosMaisVendidos();
        const barbeirosTop = await adminModel.barbeirosComMaisAtendimentos();

        const ticketMedio = totalPagamentos > 0 ? faturamento / totalPagamentos : 0;

        res.json({
            faturamento: Number(faturamento),
            atendimentos,
            clientes,
            ticketMedio: Number(ticketMedio.toFixed(2)),
            servicosTop,
            barbeirosTop,
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function clientes(req, res) {
    try {
        const lista = await adminModel.listarClientes();
        res.json(lista);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function agendamentos(req, res) {
    try {
        const lista = await adminModel.listarAgendamentosGerais();
        res.json(lista);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { dashboard, clientes, agendamentos };