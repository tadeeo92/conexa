const multer = require('multer');
const path = require('path');

// Carpeta donde se guardarán las imágenes de posts
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts');  // CAMBIO aquí: carpeta para posts
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposAceptados = /jpeg|jpg|png/;
  const extension = tiposAceptados.test(path.extname(file.originalname).toLowerCase());
  const mimetype = tiposAceptados.test(file.mimetype);
  if (extension && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no válido (solo .jpg, .jpeg, .png)'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
