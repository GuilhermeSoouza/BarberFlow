const barbeiroModel = require('../models/barbeiroModel');

async function listar(req, res) {
    try {
        const barbeiros = await barbeiroModel.listarBarbeiros();
        res.json(barbeiros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    try {
        const { usuario_id, foto_url, especialidade } = req.body;
        if (!usuario_id) {
            return res.status(400).json({ erro: 'usuario_id é obrigatório.' });
        }
        const id = await barbeiroModel.criarBarbeiro({ usuario_id, foto_url, especialidade });
        res.status(201).json({ id, usuario_id, foto_url, especialidade });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { listar, criar };