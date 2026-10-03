const express = require('express');
const router = express.Router();
const barbeiroController = require('../controllers/barbeiroController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.get('/barbeiros', barbeiroController.listar);
router.post('/barbeiros', verificarToken, verificarTipo('admin'), barbeiroController.criar);

module.exports = router;