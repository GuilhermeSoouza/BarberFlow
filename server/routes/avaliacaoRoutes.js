const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.post('/agendamentos/:agendamentoId/avaliar', verificarToken, verificarTipo('cliente'), avaliacaoController.criar);

module.exports = router;