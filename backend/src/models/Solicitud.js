const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./Cliente');
const Cotizacion = require('./Cotizacion');
const Vehiculo = require('./Vehiculo');

const Solicitud = sequelize.define('Solicitud', {
  id_solicitud: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    references: {
      model: Cliente,
      key: 'id_cliente'
    }
  },
  id_cotizacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Cotizacion,
      key: 'id_cotizacion'
    }
  },
  fecha_solicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_servicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pisos_origen: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pisos_destino: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  servicio_empaque: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  id_vehiculo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Vehiculo,
      key: 'id_vehiculo'
    }
  },
  observaciones: {
    type: DataTypes.TEXT
  },
  estatus: {
    type: DataTypes.ENUM('Pendiente', 'Aprobada', 'Empacado', 'En Ruta', 'Entrega', 'Completada', 'Rechazada'),
    defaultValue: 'Pendiente'
  }
}, {
  tableName: 'solicitudes_mudanza',
  timestamps: true
});

module.exports = Solicitud;
