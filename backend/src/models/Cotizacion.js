const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');

const Cotizacion = sequelize.define('Cotizacion', {
  id_cotizacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Cliente,
      key: 'id_cliente'
    }
  },
  kilometros: {
    type: DataTypes.FLOAT
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: true
  },
  servicio_empaque: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tipo_unidad: {
    type: DataTypes.STRING
  },
  pisos: {
    type: DataTypes.INTEGER
  },
  costo_estimado: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'cotizaciones',
  timestamps: true
});

module.exports = Cotizacion;
