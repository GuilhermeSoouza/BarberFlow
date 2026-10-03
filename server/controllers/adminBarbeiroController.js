const barbeiroModel = require('../models/barbeiroModel');

async function listar(req, res) {
    try {
        const barbeiros = await barbeiroModel.listarTodos();
        res.json(barbeiros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function atualizar(req, res) {
    try {
        const { id } = req.params;
        const { especialidade, foto_url } = req.body;

        const barbeiro = await barbeiroModel.buscarPorId(id);
        if (!barbeiro) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        await barbeiroModel.atualizarBarbeiro(id, { especialidade, foto_url });
        res.json({ mensagem: 'Barbeiro atualizado com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function remover(req, res) {
    try {
        const { id } = req.params;

        const barbeiro = await barbeiroModel.buscarPorId(id);
        if (!barbeiro) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        await barbeiroModel.definirAtivo(id, false);
        res.json({ mensagem: 'Barbeiro removido com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

async function reativar(req, res) {
    try {
        const { id } = req.params;
        await barbeiroModel.definirAtivo(id, true);
        res.json({ mensagem: 'Barbeiro reativado com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
}

module.exports = { listar, atualizar, remover, reativar };