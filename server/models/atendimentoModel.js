const db = require('../config/database');

async function criarAtendimento(agendamento_id) {
    const [resultado] = await db.query(
        'INSERT INTO atendimentos (agendamento_id, inicio) VALUES (?, NOW())',
        [agendamento_id]
    );
    return resultado.insertId;
}

async function buscarPorAgendamentoId(agendamento_id) {
    const [linhas] = await db.query(
        'SELECT * FROM atendimentos WHERE agendamento_id = ?',
        [agendamento_id]
    );
    return linhas[0];
}

async function finalizar(id) {
    await db.query(`
        UPDATE atendimentos
        SET fim = NOW(),
            duracao_minutos = TIMESTAMPDIFF(MINUTE, inicio, NOW())
        WHERE id = ?
    `, [id]);
}

module.exports = { criarAtendimento, buscarPorAgendamentoId, finalizar };