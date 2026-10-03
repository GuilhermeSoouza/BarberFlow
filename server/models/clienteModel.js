const db = require('../config/database');

async function buscarPorUsuarioId(usuario_id) {
    const [linhas] = await db.query(
        'SELECT * FROM clientes WHERE usuario_id = ?',
        [usuario_id]
    );
    return linhas[0];
}

async function criarCliente(usuario_id) {
    const [resultado] = await db.query(
        'INSERT INTO clientes (usuario_id) VALUES (?)',
        [usuario_id]
    );
    return resultado.insertId;
}

module.exports = { buscarPorUsuarioId, criarCliente };