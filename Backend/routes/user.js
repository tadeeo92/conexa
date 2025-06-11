const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const uploadProfilePic = require('../middleware/uploadProfilePic');
const Usuario = require('../models/user');

// Ruta para obtener el perfil del usuario autenticado
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id)
      .select('-password')
      .populate('followers', 'nombre fotoPerfil')
      .populate('following', 'nombre fotoPerfil');

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (err) {
    console.error('Error en /perfil:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Ruta para obtener todos los usuarios excepto el actual
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usuarios = await Usuario.find({ _id: { $ne: req.usuario._id } }).select('-password');
    res.json(usuarios);
  } catch (err) {
    console.error('Error en GET /api/user:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Ruta para subir foto de perfil
router.post(
  '/upload-profile-pic',
  authMiddleware,
  uploadProfilePic.single('imagen'),
  async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.usuario._id);
      if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

      usuario.fotoPerfil = `/uploads/perfiles/${req.file.filename}`;
      await usuario.save();

      res.json({ message: 'Foto de perfil actualizada', fotoPerfil: usuario.fotoPerfil });
    } catch (err) {
      console.error('Error al subir la foto de perfil:', err);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
);

// Ruta para seguir o dejar de seguir a un usuario
router.post('/follow/:id', authMiddleware, async (req, res) => {
  try {
    const usuarioActual = await Usuario.findById(req.usuario._id);
    const usuarioObjetivo = await Usuario.findById(req.params.id);

    if (!usuarioObjetivo) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const yaLoSigue = usuarioActual.following.includes(usuarioObjetivo._id);

    if (yaLoSigue) {
      usuarioActual.following.pull(usuarioObjetivo._id);
      usuarioObjetivo.followers.pull(usuarioActual._id);
    } else {
      usuarioActual.following.push(usuarioObjetivo._id);
      usuarioObjetivo.followers.push(usuarioActual._id);
    }

    await usuarioActual.save();
    await usuarioObjetivo.save();

    res.json({ siguiendo: !yaLoSigue });
  } catch (err) {
    console.error('Error en POST /follow/:id:', err);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Ruta para obtener perfil de otro usuario (con populate y teSigo)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const usuarioObjetivo = await Usuario.findById(req.params.id)
      .select('-password')
      .populate('followers', 'nombre fotoPerfil')
      .populate('following', 'nombre fotoPerfil');

    if (!usuarioObjetivo) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const teSigo = usuarioObjetivo.followers.some(
      (follower) => follower._id.toString() === req.usuario._id
    );

    res.json({
      ...usuarioObjetivo.toObject(),
      teSigo
    });
  } catch (err) {
    console.error('Error en GET /user/:id', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Obtener lista de seguidores
router.get('/:id/followers', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate('followers', '-password');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json(usuario.followers);
  } catch (err) {
    console.error('Error en GET /:id/followers:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

// Obtener lista de usuarios que sigue
router.get('/:id/following', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate('following', '-password');
    if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json(usuario.following);
  } catch (err) {
    console.error('Error en GET /:id/following:', err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
});

module.exports = router;
