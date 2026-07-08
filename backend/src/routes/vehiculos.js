const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.get('/', vehiculosController.obtenerVehiculos);

router.post('/', verificarToken, esAdmin, vehiculosController.crearVehiculo);
router.put('/:id', verificarToken, esAdmin, vehiculosController.actualizarVehiculo);
router.delete('/:id', verificarToken, esAdmin, vehiculosController.eliminarVehiculo);

module.exports = router;
