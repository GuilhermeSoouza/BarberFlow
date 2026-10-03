const db = require('../config/database');

async function verificarConflito(barbeiro_id, data_hora) {
    const [linhas] = await db.query(
        'SELECT id FROM agendamentos WHERE barbeiro_id = ? AND data_hora = ? AND status != "cancelado"',
        [barbeiro_id, data_hora]
    );
    return linhas.length > 0;
}

async function criarAgendamento({ cliente_id, barbeiro_id, servico_id, data_hora }) {
    const [resultado] = await db.query(
        'INSERT INTO agendamentos (cliente_id, barbeiro_id, servico_id, data_hora) VALUES (?, ?, ?, ?)',
        [cliente_id, barbeiro_id, servico_id, data_hora]
    );
    return resultado.insertId;
}

async function listarPorCliente(cliente_id) {
    const [linhas] = await db.query(`
        SELECT a.id, a.data_hora, a.status, s.nome AS servico, s.preco, u.nome AS barbeiro
        FROM agendamentos a
        JOIN servicos s ON s.id = a.servico_id
        JOIN barbeiros b ON b.id = a.barbeiro_id
        JOIN usuarios u ON u.id = b.usuario_id
        WHERE a.cliente_id = ?
        ORDER BY a.data_hora DESC
    `, [cliente_id]);
    return linhas;
}

async function buscarPorId(id) {
    const [linhas] = await db.query('SELECT * FROM agendamentos WHERE id = ?', [id]);
    return linhas[0];
}

async function cancelar(id) {
    await db.query(
        'UPDATE agendamentos SET status = "cancelado" WHERE id = ?',
        [id]
    );
}

async function listarPorBarbeiroEData(barbeiro_id, data) {
    const [linhas] = await db.query(`
        SELECT a.id, a.data_hora, a.status, s.nome AS servico, s.duracao_minutos, u.nome AS cliente
        FROM agendamentos a
        JOIN servicos s ON s.id = a.servico_id
        JOIN clientes c ON c.id = a.cliente_id
        JOIN usuarios u ON u.id = c.usuario_id
        WHERE a.barbeiro_id = ? AND DATE(a.data_hora) = ? AND a.status != 'cancelado'
        ORDER BY a.data_hora ASC
    `, [barbeiro_id, data]);
    return linhas;
}

async function atualizarStatus(id, status) {
    await db.query('UPDATE agendamentos SET status = ? WHERE id = ?', [status, id]);
}

async function contarPorBarbeiroEData(barbeiro_id, data) {
    const [linhas] = await db.query(`
        SELECT status, COUNT(*) AS total
        FROM agendamentos
        WHERE barbeiro_id = ? AND DATE(data_hora) = ? AND status != 'cancelado'
        GROUP BY status
    `, [barbeiro_id, data]);

    const contagem = { confirmado: 0, em_andamento: 0, concluido: 0 };
    linhas.forEach((linha) => {
        contagem[linha.status] = linha.total;
    });
    return contagem;
}

async function listarHistoricoPorBarbeiro(barbeiro_id) {
    const [linhas] = await db.query(`
        SELECT a.id, a.data_hora, s.nome AS servico, u.nome AS cliente, at.duracao_minutos
        FROM agendamentos a
        JOIN servicos s ON s.id = a.servico_id
        JOIN clientes c ON c.id = a.cliente_id
        JOIN usuarios u ON u.id = c.usuario_id
        LEFT JOIN atendimentos at ON at.agendamento_id = a.id
        WHERE a.barbeiro_id = ? AND a.status = 'concluido'
        ORDER BY a.data_hora DESC
    `, [barbeiro_id]);
    return linhas;
}

module.exports = {
    verificarConflito,
    criarAgendamento,
    listarPorCliente,
    buscarPorId,
    cancelar,
    listarPorBarbeiroEData,
    atualizarStatus,
    contarPorBarbeiroEData,
    listarHistoricoPorBarbeiro,
};