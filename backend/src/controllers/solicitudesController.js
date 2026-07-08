const { Solicitud } = require("../models");

exports.crearSolicitud = async (req, res) => {
  try {
    const {
      id_cliente,
      fecha_servicio,
      origen,
      destino,
      observaciones,
      id_cotizacion,
    } = req.body;

    if (!fecha_servicio) {
      return res
        .status(400)
        .json({ error: "La fecha de servicio es requerida" });
    }

    const nuevaSolicitud = await Solicitud.create({
      id_cliente,
      fecha_servicio,
      origen,
      destino,
      observaciones,
      id_cotizacion: id_cotizacion || null,
    });

    res.status(201).json({
      mensaje: "Solicitud enviada exitosamente",
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    res
      .status(500)
      .json({ error: "Error al enviar la solicitud", detalle: error.message });
  }
};

exports.obtenerTodasLasSolicitudes = async (req, res) => {
  try {
    const { Cliente, Vehiculo } = require('../models');
    const Solicitud = require('../models/Solicitud');
    const solicitudes = await Solicitud.findAll({
      include: [
        { model: Cliente },
        { model: Vehiculo }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(solicitudes);
  } catch (error) {
    console.error("Error fetching all requests", error);
    res.status(500).json({ error: 'Error al obtener las solicitudes' });
  }
};

exports.actualizarEstadoSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus, id_vehiculo } = req.body;
    const Solicitud = require('../models/Solicitud');
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada' });
    
    const updatePayload = {};
    if (estatus !== undefined) updatePayload.estatus = estatus;
    if (id_vehiculo !== undefined) updatePayload.id_vehiculo = id_vehiculo;
    
    await solicitud.update(updatePayload);
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

exports.obtenerMisSolicitudes = async (req, res) => {
  try {
    const { Vehiculo, Conductor } = require('../models');
    const Solicitud = require('../models/Solicitud');
    const solicitudes = await Solicitud.findAll({
      where: { id_cliente: req.user.id },
      include: [
        {
          model: Vehiculo,
          include: [{ model: Conductor }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(solicitudes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mis solicitudes', details: error.message, stack: error.stack });
  }
};
