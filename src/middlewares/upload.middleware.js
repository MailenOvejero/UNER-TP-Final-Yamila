// upload.middleware.js

import multer from 'multer'; // <-- Se añade la importación de Multer
// ... (Nota: Dependiendo de tu configuración de archivos en el sistema operativo, 
// podría ser necesario importar 'path' y 'fs' para manejar directorios de destino complejos, 
// pero se mantiene la lógica original para ser lo menos invasivo posible).

// Almacenamiento para Comprobantes
export const comprobanteStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta dedicada para comprobantes (debe existir)
    cb(null, './public/uploads/comprobantes'); 
  },
  filename: (req, file, cb) => {
    // Nombrar el archivo usando el ID del usuario (cliente) y un timestamp
    // Asume que req.user.id está disponible gracias a verifyToken
    const extension = file.mimetype.split('/')[1];
    cb(null, `comprobante-user-${req.user.id}-${Date.now()}.${extension}`);
  }
});

// Instancia de Multer para comprobantes
export const uploadComprobante = multer({
    storage: comprobanteStorage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Límite de 1MB
    fileFilter: (req, file, cb) => {
      // Permitir solo PDF o imágenes para comprobantes
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        // Rechaza el archivo y pasa un error
        cb(new Error('Tipo de archivo no válido. Solo se permiten PDF o imágenes.'), false);
      }
    }
});