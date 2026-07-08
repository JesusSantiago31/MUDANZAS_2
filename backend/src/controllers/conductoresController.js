const { Conductor } = require('../models');

exports.obtenerConductores = async (req, res) => {
  try {
    const conductores = await Conductor.findAll();
    res.json(conductores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener conductores' });
  }
};

exports.crearConductor = async (req, res) => {
  try {
    const { nombre, telefono, licencia } = req.body;
    const nuevo = await Conductor.create({ nombre, telefono, licencia });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear conductor' });
  }
};

exports.actualizarConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const conductor = await Conductor.findByPk(id);
    if (!conductor) return res.status(404).json({ error: 'No encontrado' });
    await conductor.update(req.body);
    res.json(conductor);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};
