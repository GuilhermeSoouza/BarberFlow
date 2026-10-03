const db = require('../config/database');

async function faturamentoDoMes() {
    const [linhas] = await db.query(`
        SELECT COALESCE(SUM(p.valor), 0) AS faturamento, COUNT(*) AS totalPagamentos
        FROM pagamentos p
        WHERE p.status = 'pago'
        AND MONTH(p.pago_em) = MONTH(CURDATE())
        AND YEAR(p.pago_em) = YEAR(CURDATE())
    `);
    return linhas[0];
}

async function contarAtendimentosDoMes() {
    const [linhas] = await db.query(`
        SELECT COUNT(*) AS total
        FROM agendamentos
        WHERE status = 'concluido'
        AND MONTH(data_hora) = MONTH(CURDATE())
        AND YEAR(data_hora) = YEAR(CURDATE())
    `);
    return linhas[0].total;
}

async function contarClientesAtivos() {
    const [linhas] = await db.query(`
        SELECT COUNT(DISTINCT cliente_id) AS total
        FROM agendamentos
        WHERE status != 'cancelado'
    `);
    return linhas[0].total;
}

async function servicosMaisVendidos() {
    const [linhas] = await db.query(`
        SELECT s.nome, COUNT(*) AS total
        FROM agendamentos a
        JOIN servicos s ON s.id = a.servico_id
        WHERE a.status = 'concluido'
        GROUP BY s.id, s.nome
        ORDER BY total DESC
        LIMIT 5
    `);
    return linhas;
}

async function barbeirosComMaisAtendimentos() {
    const [linhas] = await db.query(`
        SELECT u.nome, COUNT(*) AS total
        FROM agendamentos a
        JOIN barbeiros b ON b.id = a.barbeiro_id
        JOIN usuarios u ON u.id = b.usuario_id
        WHERE a.status = 'concluido'
        GROUP BY b.id, u.nome
        ORDER BY total DESC
        LIMIT 5
    `);
    return linhas;
}

async function listarClientes() {
    const [linhas] = await db.query(`
        SELECT
            c.id,
            u.nome,
            u.telefone,
            COUNT(a.id) AS totalVisitas,
            MAX(a.data_hora) AS ultimaVisita
        FROM clientes c
        JOIN usuarios u ON u.id = c.usuario_id
        LEFT JOIN agendamentos a ON a.cliente_id = c.id AND a.status = 'concluido'
        GROUP BY c.id, u.nome, u.telefone
        ORDER BY u.nome ASC
    `);
    return linhas;
}

async function listarAgendamentosGerais() {
    const [linhas] = await db.query(`
        SELECT
            a.id, a.data_hora, a.status,
            cu.nome AS cliente,
            bu.nome AS barbeiro,
            s.nome AS servico
        FROM agendamentos a
        JOIN clientes c ON c.id = a.cliente_id
        JOIN usuarios cu ON cu.id = c.usuario_id
        JOIN barbeiros b ON b.id = a.barbeiro_id
        JOIN usuarios bu ON bu.id = b.usuario_id
        JOIN servicos s ON s.id = a.servico_id
        ORDER BY a.data_hora DESC
        LIMIT 100
    `);
    return linhas;
}

module.exports = {
    faturamentoDoMes,
    contarAtendimentosDoMes,
    contarClientesAtivos,
    servicosMaisVendidos,
    barbeirosComMaisAtendimentos,
    listarClientes,
    listarAgendamentosGerais,
};