const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.use(verificarToken, esAdmin);

router.get('/stats', adminController.obtenerEstadisticas);
router.get('/clientes', adminController.obtenerClientes);

module.exports = router;
