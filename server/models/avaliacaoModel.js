const db = require('../config/database');

async function buscarPorAgendamentoId(agendamento_id) {
    const [linhas] = await db.query(`
        SELECT av.*
        FROM avaliacoes av
        JOIN atendimentos at ON at.id = av.atendimento_id
        WHERE at.agendamento_id = ?
    `, [agendamento_id]);
    return linhas[0];
}

async function criarAvaliacao({ atendimento_id, nota, comentario }) {
    const [resultado] = await db.query(
        'INSERT INTO avaliacoes (atendimento_id, nota, comentario) VALUES (?, ?, ?)',
        [atendimento_id, nota, comentario]
    );
    return resultado.insertId;
}

module.exports = { buscarPorAgendamentoId, criarAvaliacao };