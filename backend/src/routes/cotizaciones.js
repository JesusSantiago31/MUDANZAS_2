const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizacionesController');
const { verificarToken } = require('../middleware/authMiddleware');

router.post('/', cotizacionesController.crearCotizacion);
router.get('/mis-cotizaciones', verificarToken, cotizacionesController.obtenerMisCotizaciones);

module.exports = router;

