const sequelize = require('./src/config/database');

async function run() {
  try {
    const values = ['Empacado', 'En Ruta', 'Entrega'];
    for (const v of values) {
      try {
        await sequelize.query(`ALTER TYPE "enum_solicitudes_mudanza_estatus" ADD VALUE IF NOT EXISTS '${v}'`);
        console.log('Added ' + v);
      } catch(e) {
        console.log(e.message);
      }
    }
  } finally {
    sequelize.close();
  }
}
run();
