const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');  // <- Modelo de usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ✅ Importamos jsonwebtoken

// ✅ Importar validaciones
const { validarRegistro, validarLogin } = require('../middleware/validaciones');

// ✅ Claves del entorno
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Registro con validación
router.post('/registro', validarRegistro, async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ nombre, correo, password: hash });
    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Login con validación
router.post('/login', validarLogin, async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ msg: 'Correo o contraseña incorrectos' });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(400).json({ msg: 'Correo o contraseña incorrectos' });
    }

    // ✅ Crear payload
    const payload = {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo
    };

    // ✅ Firmar token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ msg: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;
