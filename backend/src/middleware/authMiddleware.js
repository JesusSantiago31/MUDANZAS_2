const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'super_secret_jwt_key_12345');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token no válido.' });
  }
};

exports.esAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};
