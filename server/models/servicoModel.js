const db = require('../config/database');

async function listarServicos() {
    const [linhas] = await db.query('SELECT * FROM servicos WHERE ativo = true');
    return linhas;
}

async function listarTodos() {
    const [linhas] = await db.query('SELECT * FROM servicos ORDER BY ativo DESC, nome ASC');
    return linhas;
}

async function criarServico({ nome, duracao_minutos, preco }) {
    const [resultado] = await db.query(
        'INSERT INTO servicos (nome, duracao_minutos, preco) VALUES (?, ?, ?)',
        [nome, duracao_minutos, preco]
    );
    return resultado.insertId;
}

async function buscarPorId(id) {
    const [linhas] = await db.query('SELECT * FROM servicos WHERE id = ?', [id]);
    return linhas[0];
}

async function atualizarServico(id, { nome, duracao_minutos, preco }) {
    await db.query(
        'UPDATE servicos SET nome = ?, duracao_minutos = ?, preco = ? WHERE id = ?',
        [nome, duracao_minutos, preco, id]
    );
}

async function definirAtivo(id, ativo) {
    await db.query('UPDATE servicos SET ativo = ? WHERE id = ?', [ativo, id]);
}

module.exports = {
    listarServicos,
    listarTodos,
    criarServico,
    buscarPorId,
    atualizarServico,
    definirAtivo,
};