const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que exista la carpeta uploads/perfiles
const perfilDir = path.join(__dirname, '..', 'uploads', 'perfiles');
if (!fs.existsSync(perfilDir)) {
  fs.mkdirSync(perfilDir, { recursive: true });
}

// Configurar almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, perfilDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `perfil_${Date.now()}${ext}`;
    cb(null, fileName);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = function (req, file, cb) {
  const allowed = ['.png', '.jpg', '.jpeg', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (.png, .jpg, .jpeg, .gif)'));
  }
};

const uploadProfilePic = multer({ storage, fileFilter });

module.exports = uploadProfilePic;
