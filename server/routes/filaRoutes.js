const express = require('express');
const router = express.Router();
const filaController = require('../controllers/filaController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.post('/fila', verificarToken, verificarTipo('cliente'), filaController.entrar);
router.get('/fila/minha-posicao', verificarToken, verificarTipo('cliente'), filaController.minhaPosicao);
router.get('/barbeiro/fila', verificarToken, verificarTipo('barbeiro'), filaController.listarFilaBarbeiro);
router.post('/fila/:id/chamar', verificarToken, verificarTipo('barbeiro'), filaController.chamarProximo);
router.post('/fila/:id/concluir', verificarToken, verificarTipo('barbeiro'), filaController.concluirFila);

module.exports = router;