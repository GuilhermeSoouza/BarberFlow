const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.post('/agendamentos', verificarToken, verificarTipo('cliente'), agendamentoController.criar);
router.get('/agendamentos', verificarToken, verificarTipo('cliente'), agendamentoController.listar);
router.delete('/agendamentos/:id', verificarToken, verificarTipo('cliente'), agendamentoController.cancelar);

module.exports = router;