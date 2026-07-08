const { Solicitud, Cliente, Vehiculo, Conductor } = require('../models');

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const total = await Solicitud.count();
    const pendientes = await Solicitud.count({ where: { estatus: 'Pendiente' } });
    const aprobadas = await Solicitud.count({ where: { estatus: 'Aprobada' } });
    const completadas = await Solicitud.count({ where: { estatus: 'Completada' } });
    const rechazadas = await Solicitud.count({ where: { estatus: 'Rechazada' } });

    res.json({ total, pendientes, aprobadas, completadas, rechazadas });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener stats' });
  }
};

exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: Solicitud, as: 'Solicituds' }]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};
