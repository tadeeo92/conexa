const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // multer configurado

// Crear una publicación con posible imagen
router.post('/', authMiddleware, upload.single('imagen'), async (req, res) => {
  try {
    const { contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({ mensaje: 'El contenido es obligatorio' });
    }

    // Si hay archivo imagen cargado, guardamos el nombre
    const nombreImagen = req.file ? req.file.filename : null;

    const nuevoPost = new Post({
      contenido,
      autor: req.usuario._id,
      imagen: nombreImagen
    });

    await nuevoPost.save();

    // Buscar post guardado con autor poblado
    const postConAutor = await Post.findById(nuevoPost._id).populate('autor', 'nombre correo');

    res.status(201).json(postConAutor);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ mensaje: 'Error al crear publicación' });
  }
});

// Obtener todos los posts (feed general) — protegido
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('autor', 'nombre correo')
      .populate('likes', 'nombre')
      .sort({ fechaCreacion: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ mensaje: 'Error al obtener publicaciones' });
  }
});

// Obtener posts de un usuario específico
router.get('/usuario/:idUsuario', async (req, res) => {
  try {
    const posts = await Post.find({ autor: req.params.idUsuario })
    .populate('autor', 'nombre correo')  // <== Aquí el populate
      .sort({ fechaCreacion: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener publicaciones del usuario' });
  }
});

// Editar post por ID (sin manejar imagen en esta versión)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({ mensaje: 'El contenido es obligatorio' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ mensaje: 'Post no encontrado' });
    }

    if (post.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para editar este post' });
    }

    post.contenido = contenido;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error al editar post:', error);
    res.status(500).json({ mensaje: 'Error al editar publicación' });
  }
});

// Borrar post por ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ mensaje: 'Post no encontrado' });
    }

    if (post.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para borrar este post' });
    }

    await post.deleteOne();

    res.json({ mensaje: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error al borrar post:', error);
    res.status(500).json({ mensaje: 'Error al borrar publicación' });
  }
});

// Dar o quitar like a un post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.usuario._id;

    if (!post) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    const yaDioLike = post.likes.some(id => id.toString() === userId.toString());

    if (yaDioLike) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const likesIds = post.likes.map(id => id.toString());

    res.json({
      mensaje: yaDioLike ? 'Like eliminado' : 'Like agregado',
      likes: likesIds
    });
  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({ mensaje: 'Error al dar o quitar like' });
  }
});

module.exports = router;
