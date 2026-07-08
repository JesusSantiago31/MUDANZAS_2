const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudesController');
const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

router.post('/', solicitudesController.crearSolicitud);

router.get('/', verificarToken, esAdmin, solicitudesController.obtenerTodasLasSolicitudes);
router.get('/mis-solicitudes', verificarToken, solicitudesController.obtenerMisSolicitudes);
router.put('/:id/estado', verificarToken, esAdmin, solicitudesController.actualizarEstadoSolicitud);

module.exports = router;
