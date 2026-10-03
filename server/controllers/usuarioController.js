const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');
const clienteModel = require('../models/clienteModel');

async function cadastrar(req, res) {
    try {
        const { nome, email, senha, tipo, telefone } = req.body;

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({ erro: 'Nome, email, senha e tipo são obrigatórios.' });
        }

        const tiposValidos = ['cliente', 'barbeiro', 'admin'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
        }

        const usuarioExistente = await usuarioModel.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const id = await usuarioModel.criarUsuario({
            nome,
            email,
            senha: senhaHash,
            tipo,
            telefone,
        });

        if (tipo === 'cliente') {
            await clienteModel.criarCliente(id);
        }

        return res.status(201).json({ id, nome, email, tipo });
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
}

module.exports = { cadastrar };