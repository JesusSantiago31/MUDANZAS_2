const express = require('express');
const router = express.Router();
const conductoresController = require('../controllers/conductoresController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.use(verificarToken, esAdmin);

router.get('/', conductoresController.obtenerConductores);
router.post('/', conductoresController.crearConductor);
router.put('/:id', conductoresController.actualizarConductor);

module.exports = router;
