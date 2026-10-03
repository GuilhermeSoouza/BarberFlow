const db = require('../config/database');

async function listarBarbeiros() {
    const [linhas] = await db.query(`
        SELECT b.id, u.nome, b.foto_url, b.especialidade, b.ativo
        FROM barbeiros b
        JOIN usuarios u ON u.id = b.usuario_id
        WHERE b.ativo = true
    `);
    return linhas;
}

async function listarTodos() {
    const [linhas] = await db.query(`
        SELECT b.id, u.nome, u.email, b.foto_url, b.especialidade, b.ativo
        FROM barbeiros b
        JOIN usuarios u ON u.id = b.usuario_id
        ORDER BY b.ativo DESC, u.nome ASC
    `);
    return linhas;
}

async function criarBarbeiro({ usuario_id, foto_url, especialidade }) {
    const [resultado] = await db.query(
        'INSERT INTO barbeiros (usuario_id, foto_url, especialidade) VALUES (?, ?, ?)',
        [usuario_id, foto_url, especialidade]
    );
    return resultado.insertId;
}

async function buscarPorUsuarioId(usuario_id) {
    const [linhas] = await db.query(
        'SELECT * FROM barbeiros WHERE usuario_id = ?',
        [usuario_id]
    );
    return linhas[0];
}

async function buscarPorId(id) {
    const [linhas] = await db.query('SELECT * FROM barbeiros WHERE id = ?', [id]);
    return linhas[0];
}

async function atualizarBarbeiro(id, { especialidade, foto_url }) {
    await db.query(
        'UPDATE barbeiros SET especialidade = ?, foto_url = ? WHERE id = ?',
        [especialidade, foto_url, id]
    );
}

async function definirAtivo(id, ativo) {
    await db.query('UPDATE barbeiros SET ativo = ? WHERE id = ?', [ativo, id]);
}

module.exports = {
    listarBarbeiros,
    listarTodos,
    criarBarbeiro,
    buscarPorUsuarioId,
    buscarPorId,
    atualizarBarbeiro,
    definirAtivo,
};