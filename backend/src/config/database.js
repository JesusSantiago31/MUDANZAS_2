const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const { Sequelize } = require('sequelize');

// Configure Sequelize to connect to Supabase PostgreSQL using DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    // Required for SSL connections if Supabase enforces it
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
