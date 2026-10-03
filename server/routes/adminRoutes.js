const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminBarbeiroController = require('../controllers/adminBarbeiroController');
const adminServicoController = require('../controllers/adminServicoController');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');

router.get('/admin/dashboard', verificarToken, verificarTipo('admin'), adminController.dashboard);
router.get('/admin/clientes', verificarToken, verificarTipo('admin'), adminController.clientes);
router.get('/admin/agendamentos', verificarToken, verificarTipo('admin'), adminController.agendamentos);

router.get('/admin/barbeiros', verificarToken, verificarTipo('admin'), adminBarbeiroController.listar);
router.put('/admin/barbeiros/:id', verificarToken, verificarTipo('admin'), adminBarbeiroController.atualizar);
router.delete('/admin/barbeiros/:id', verificarToken, verificarTipo('admin'), adminBarbeiroController.remover);
router.post('/admin/barbeiros/:id/reativar', verificarToken, verificarTipo('admin'), adminBarbeiroController.reativar);

router.get('/admin/servicos', verificarToken, verificarTipo('admin'), adminServicoController.listar);
router.put('/admin/servicos/:id', verificarToken, verificarTipo('admin'), adminServicoController.atualizar);
router.delete('/admin/servicos/:id', verificarToken, verificarTipo('admin'), adminServicoController.remover);
router.post('/admin/servicos/:id/reativar', verificarToken, verificarTipo('admin'), adminServicoController.reativar);

module.exports = router;