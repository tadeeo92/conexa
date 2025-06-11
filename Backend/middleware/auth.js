function authMiddleware(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ msg: 'No autorizado, inicia sesión primero' });
  }
}

module.exports = authMiddleware;
