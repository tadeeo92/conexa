const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fotoPerfil: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]
});

module.exports = mongoose.model('Usuario', userSchema);
