const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Solicitud = require('./Solicitud');
const Vehiculo = require('./Vehiculo');
const Conductor = require('./Conductor');

const Asignacion = sequelize.define('Asignacion', {
  id_asignacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    references: {
      model: Solicitud,
      key: 'id_solicitud'
    }
  },
  id_vehiculo: {
    type: DataTypes.INTEGER,
    references: {
      model: Vehiculo,
      key: 'id_vehiculo'
    }
  },
  id_conductor: {
    type: DataTypes.INTEGER,
    references: {
      model: Conductor,
      key: 'id_conductor'
    }
  }
}, {
  tableName: 'asignaciones',
  timestamps: true
});

module.exports = Asignacion;
