const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Conductor = require('./Conductor');

const Vehiculo = sequelize.define('Vehiculo', {
  id_vehiculo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  placas: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  capacidad: {
    type: DataTypes.STRING
  },
  precio_base: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  disponibilidad: {
    type: DataTypes.ENUM('Disponible', 'En Mantenimiento', 'Ocupado'),
    defaultValue: 'Disponible'
  },
  id_conductor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Conductor,
      key: 'id_conductor'
    }
  }
}, {
  tableName: 'vehiculos',
  timestamps: false
});

module.exports = Vehiculo;
