const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await User.findById(decoded.id).select('-password');
    if (!usuario) return res.status(401).json({ msg: 'Usuario no encontrado' });

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Token inválido o expirado:', error.message);
    return res.status(401).json({ msg: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
