const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.get('/servicos', servicoController.listar);
router.post('/servicos', verificarToken, verificarTipo('admin'), servicoController.criar);

module.exports = router;