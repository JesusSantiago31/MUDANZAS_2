const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('✅ .env loaded (server) from', path.resolve(__dirname, '../../.env'));
console.log('🔎 SERVER DATABASE_URL:', process.env.DATABASE_URL);

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes');

// Ensure JWT secret is set
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in .env');
  process.exit(1);
}


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(async () => {
    console.log('Database connected and synced');
    
    // Auto-seed mock data
    const { Vehiculo, Conductor } = require('./models');
    try {
        const countVehiculos = await Vehiculo.count();
        if (countVehiculos === 0) {
            await Vehiculo.bulkCreate([
                { tipo: 'Camioneta Ligera', placas: 'ABC-1234', capacidad: '1.5 Toneladas', disponibilidad: 'Disponible' },
                { tipo: 'Camión de Mudanza', placas: 'XYZ-9876', capacidad: '5 Toneladas', disponibilidad: 'Disponible' },
                { tipo: 'Camioneta Pick-up', placas: 'MUD-5555', capacidad: '800 Kg', disponibilidad: 'Ocupado' }
            ]);
            console.log('Seeded mock vehicles successfully.');
        }
        
        const countConductores = await Conductor.count();
        if (countConductores === 0) {
            await Conductor.bulkCreate([
                { nombre: 'Carlos Mendoza', telefono: '555-111-2222', licencia: 'LIC-99901', disponibilidad: true },
                { nombre: 'Roberto Gómez', telefono: '555-333-4444', licencia: 'LIC-99902', disponibilidad: true }
            ]);
            console.log('Seeded mock drivers successfully.');
        }
    } catch (seedError) {
        console.error('Failed to seed mock data:', seedError.message);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync db:', err.message);
});
