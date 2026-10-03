const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (erro) {
        return res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
}

function verificarTipo(...tiposPermitidos) {
    return (req, res, next) => {
        if (!tiposPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({ erro: 'Você não tem permissão para acessar este recurso.' });
        }
        next();
    };
}

module.exports = { verificarToken, verificarTipo };