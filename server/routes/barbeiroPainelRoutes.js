const express = require('express');
const router = express.Router();
const barbeiroPainelController = require('../controllers/barbeiroPainelController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.get('/barbeiro/agenda', verificarToken, verificarTipo('barbeiro'), barbeiroPainelController.agendaDoDia);
router.post('/atendimentos/:agendamentoId/iniciar', verificarToken, verificarTipo('barbeiro'), barbeiroPainelController.iniciarAtendimento);
router.post('/atendimentos/:agendamentoId/finalizar', verificarToken, verificarTipo('barbeiro'), barbeiroPainelController.finalizarAtendimento);
router.get('/barbeiro/dashboard', verificarToken, verificarTipo('barbeiro'), barbeiroPainelController.dashboard);
router.get('/barbeiro/historico', verificarToken, verificarTipo('barbeiro'), barbeiroPainelController.historico);

module.exports = router;