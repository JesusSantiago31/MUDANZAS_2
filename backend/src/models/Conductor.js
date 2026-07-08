const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conductor = sequelize.define('Conductor', {
  id_conductor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  },
  licencia: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  disponibilidad: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'conductores',
  timestamps: false
});

module.exports = Conductor;
