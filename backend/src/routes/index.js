const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const cotizacionesRoutes = require('./cotizaciones');
const solicitudesRoutes = require('./solicitudes');
const vehiculosRoutes = require('./vehiculos');
const conductoresRoutes = require('./conductores');
const adminRoutes = require('./admin');

router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

router.use('/auth', authRoutes);
router.use('/cotizaciones', cotizacionesRoutes);
router.use('/solicitudes', solicitudesRoutes);
router.use('/vehiculos', vehiculosRoutes);
router.use('/conductores', conductoresRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
