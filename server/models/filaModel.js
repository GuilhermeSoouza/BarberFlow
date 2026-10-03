const db = require('../config/database');

async function entrarNaFila({ cliente_id, barbeiro_id, servico_id }) {
    const [resultado] = await db.query(
        'INSERT INTO fila (cliente_id, barbeiro_id, servico_id) VALUES (?, ?, ?)',
        [cliente_id, barbeiro_id, servico_id]
    );
    return resultado.insertId;
}

async function jaEstaNaFila(cliente_id, barbeiro_id) {
    const [linhas] = await db.query(
        `SELECT id FROM fila WHERE cliente_id = ? AND barbeiro_id = ? AND status IN ('aguardando', 'em_atendimento')`,
        [cliente_id, barbeiro_id]
    );
    return linhas.length > 0;
}

async function buscarPosicao(fila_id) {
    const [linhas] = await db.query(`
        SELECT
            f.id, f.status, f.criado_em, f.barbeiro_id,
            s.nome AS servico, s.duracao_minutos,
            (SELECT COUNT(*) FROM fila f2
             WHERE f2.barbeiro_id = f.barbeiro_id
             AND f2.status = 'aguardando'
             AND f2.criado_em < f.criado_em) AS posicao
        FROM fila f
        JOIN servicos s ON s.id = f.servico_id
        WHERE f.id = ?
    `, [fila_id]);
    return linhas[0];
}

async function buscarFilaDoClienteHoje(cliente_id) {
    const [linhas] = await db.query(
        `SELECT id FROM fila WHERE cliente_id = ? AND status IN ('aguardando', 'em_atendimento') ORDER BY id DESC LIMIT 1`,
        [cliente_id]
    );
    return linhas[0];
}

async function listarPorBarbeiro(barbeiro_id) {
    const [linhas] = await db.query(`
        SELECT f.id, f.status, f.criado_em, s.nome AS servico, s.duracao_minutos, u.nome AS cliente
        FROM fila f
        JOIN servicos s ON s.id = f.servico_id
        JOIN clientes c ON c.id = f.cliente_id
        JOIN usuarios u ON u.id = c.usuario_id
        WHERE f.barbeiro_id = ? AND f.status IN ('aguardando', 'em_atendimento')
        ORDER BY f.criado_em ASC
    `, [barbeiro_id]);
    return linhas;
}

async function atualizarStatus(id, status) {
    await db.query('UPDATE fila SET status = ? WHERE id = ?', [status, id]);
}

module.exports = {
    entrarNaFila,
    jaEstaNaFila,
    buscarPosicao,
    buscarFilaDoClienteHoje,
    listarPorBarbeiro,
    atualizarStatus,
};