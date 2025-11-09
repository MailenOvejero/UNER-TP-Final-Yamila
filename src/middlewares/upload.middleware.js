import multer from 'multer'; // <-- Se añade la importación de Multer
// OJO: Depende de la configuración de archivos en el sistema operativo, 
// podría ser necesario importar 'path' y 'fs' para manejar directorios de destino complejos, 


// Almaceno Comprobantes
export const comprobanteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // esta carpeta se crea a mano con mkdir/linux o md/ en win
    cb(null, './public/uploads/comprobantes'); 
  },
  filename: (req, file, cb) => {
    // ID del usuario (cliente)+ un timestamp
    // Asumimos que req.user.id está disponible gracias a verifyToken
    const extension = file.mimetype.split('/')[1];
    cb(null, `comprobante-user-${req.user.id}-${Date.now()}.${extension}`);
  }
});

// f(Multer para comprobantes)
export const uploadComprobante = multer({
    storage: comprobanteStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Límite de 1MB
    fileFilter: (req, file, cb) => {
      // Definimos tipo de archivo q vamos a permitir subir
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de archivo no válido. Solo se permiten PDF o imágenes.'), false);
      }
    }
});