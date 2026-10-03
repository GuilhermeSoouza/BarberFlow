const db = require('../config/database');

async function criarUsuario({ nome, email, senha, tipo, telefone }) {
    const [resultado] = await db.query(
        'INSERT INTO usuarios (nome, email, senha, tipo, telefone) VALUES (?, ?, ?, ?, ?)',
        [nome, email, senha, tipo, telefone]
    );
    return resultado.insertId;
}

async function buscarPorEmail(email) {
    const [linhas] = await db.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    return linhas[0];
}

module.exports = { criarUsuario, buscarPorEmail };