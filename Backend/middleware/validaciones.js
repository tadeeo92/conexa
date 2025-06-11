// middleware/validaciones.js

function validarRegistro(req, res, next) {
  const { nombre, correo, password } = req.body;

  if (!nombre || !correo || !password) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
  }

  // Validación simple de correo
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    return res.status(400).json({ msg: 'Correo no válido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres' });
  }

  next();
}

function validarLogin(req, res, next) {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ msg: 'Correo y contraseña son obligatorios' });
  }

  next();
}

module.exports = {
  validarRegistro,
  validarLogin
};
