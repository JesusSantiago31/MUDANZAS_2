const { Vehiculo } = require('../models');

exports.obtenerVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({ error: 'Error al obtener vehículos' });
  }
};
exports.crearVehiculo = async (req, res) => {
  try {
    const nuevo = await Vehiculo.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear vehiculo' });
  }
};

exports.actualizarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) return res.status(404).json({ error: 'No encontrado' });
    await vehiculo.update(req.body);
    res.json(vehiculo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

exports.eliminarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const vehiculo = await Vehiculo.findByPk(id);
    if (!vehiculo) return res.status(404).json({ error: 'No encontrado' });
    await vehiculo.destroy();
    res.json({ mensaje: 'Vehículo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar vehículo' });
  }
};
