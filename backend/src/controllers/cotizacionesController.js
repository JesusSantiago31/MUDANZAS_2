const { Cotizacion } = require('../models');

exports.crearCotizacion = async (req, res) => {
  try {
    const { id_cliente, origen, destino, kilometros, tipo_unidad, pisos, costo_estimado, servicio_empaque } = req.body;

    const nuevaCotizacion = await Cotizacion.create({
      id_cliente: id_cliente || null,
      origen,
      destino,
      kilometros,
      tipo_unidad,
      pisos,
      costo_estimado,
      servicio_empaque
    });

    res.status(201).json({
      mensaje: 'Cotización guardada exitosamente',
      cotizacion: nuevaCotizacion
    });
  } catch (error) {
    console.error('Error al guardar cotización:', error);
    res.status(500).json({ error: 'Error al guardar la cotización', detalle: error.message });
  }
};

exports.obtenerMisCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.findAll({
      where: { id_cliente: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(cotizaciones);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ error: 'Error al obtener las cotizaciones', detalle: error.message });
  }
};
