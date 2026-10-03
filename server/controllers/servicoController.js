const servicoModel = require('../models/servicoModel');

async function listar(req, res) {
    try {
        const servicos = await servicoModel.listarServicos();
        res.json(servicos);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function criar(req, res) {
    try {
        const { nome, duracao_minutos, preco } = req.body;
        if (!nome || !duracao_minutos || !preco) {
            return res.status(400).json({ erro: 'Nome, duração e preço são obrigatórios.' });
        }
        const id = await servicoModel.criarServico({ nome, duracao_minutos, preco });
        res.status(201).json({ id, nome, duracao_minutos, preco });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { listar, criar };