const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  contenido: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  imagen: {
    type: String,  // nombre de archivo o ruta relativa
    default: null
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
