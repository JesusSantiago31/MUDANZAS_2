const Cliente = require('./Cliente');
const Solicitud = require('./Solicitud');
const Vehiculo = require('./Vehiculo');
const Conductor = require('./Conductor');
const Asignacion = require('./Asignacion');
const Cotizacion = require('./Cotizacion');

// Relaciones
Cliente.hasMany(Solicitud, { foreignKey: 'id_cliente' });
Solicitud.belongsTo(Cliente, { foreignKey: 'id_cliente' });

Cliente.hasMany(Cotizacion, { foreignKey: 'id_cliente' });
Cotizacion.belongsTo(Cliente, { foreignKey: 'id_cliente' });

Solicitud.hasOne(Asignacion, { foreignKey: 'id_solicitud' });
Asignacion.belongsTo(Solicitud, { foreignKey: 'id_solicitud' });

Vehiculo.hasMany(Asignacion, { foreignKey: 'id_vehiculo' });
Asignacion.belongsTo(Vehiculo, { foreignKey: 'id_vehiculo' });

Conductor.hasMany(Asignacion, { foreignKey: 'id_conductor' });
Asignacion.belongsTo(Conductor, { foreignKey: 'id_conductor' });

// Nuevas relaciones
Vehiculo.belongsTo(Conductor, { foreignKey: 'id_conductor' });
Conductor.hasMany(Vehiculo, { foreignKey: 'id_conductor' });

Solicitud.belongsTo(Vehiculo, { foreignKey: 'id_vehiculo' });
Vehiculo.hasMany(Solicitud, { foreignKey: 'id_vehiculo' });

module.exports = {
  Cliente,
  Solicitud,
  Vehiculo,
  Conductor,
  Asignacion,
  Cotizacion
};
