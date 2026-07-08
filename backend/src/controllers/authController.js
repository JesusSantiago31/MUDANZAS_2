const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Cliente } = require('../models');

exports.registrar = async (req, res) => {
  try {
    const { nombre, telefono, correo, direccion, password } = req.body;
    
    // Check if user exists
    const existente = await Cliente.findOne({ where: { correo } });
    if (existente) return res.status(400).json({ error: 'El correo ya está registrado' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const nuevoCliente = await Cliente.create({
      nombre,
      telefono,
      correo,
      direccion,
      password: password_hash
    });

    res.status(201).json({ 
      mensaje: 'Cliente registrado exitosamente', 
      cliente: { id: nuevoCliente.id_cliente, nombre: nuevoCliente.nombre, rol: nuevoCliente.rol, direccion: nuevoCliente.direccion } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro', detalle: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const cliente = await Cliente.findOne({ where: { correo } });

    if (!cliente) return res.status(404).json({ error: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, cliente.password);
    if (!passwordValido) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: cliente.id_cliente, rol: cliente.rol },
      process.env.JWT_SECRET || 'super_secret_jwt_key_12345',
      { expiresIn: '24h' }
    );

    res.json({ 
      mensaje: 'Login exitoso', 
      token, 
      cliente: { id: cliente.id_cliente, nombre: cliente.nombre, rol: cliente.rol, direccion: cliente.direccion } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login', detalle: error.message });
  }
};
