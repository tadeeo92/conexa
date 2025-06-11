const fs = require("fs");
const path = require("path");

const excluir = [];

function mostrarEstructura(dir, prefijo = "") {
  const archivos = fs.readdirSync(dir);

  archivos.forEach((archivo) => {
    if (excluir.includes(archivo)) return;

    const ruta = path.join(dir, archivo);
    const stats = fs.statSync(ruta);

    if (stats.isDirectory()) {
      console.log(`${prefijo}${archivo}/`);
      mostrarEstructura(ruta, prefijo + "  ");
    } else {
      console.log(`${prefijo}${archivo}`);
    }
  });
}

mostrarEstructura(".");
