import { Router } from 'express';
import {
  getReservas,
  getReservaById,
  getReservasDelCliente,
  // Usamos el alias para la versión del controlador que maneja Multer
  createReserva as createReservaConComprobante, 
  updateReserva,
  deleteReserva,
  estadisticasReservas,
  generarReportePDF,
  generarReporteCSV
} from '../controllers/RESERVA.CONTROLLER.js';

import {
  createReservaValidation,
  updateReservaValidation
} from '../middlewares/RESERVA.VALIDATION.js';

import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import { cacheMiddleware } from '../config/cache.js';

// Importar la instancia de Multer configurada
import { uploadComprobante } from '../middlewares/upload.middleware.js'; 


const router = Router();

// Middleware de autenticación aplicado a todas las rutas de reservas
router.use(verifyToken);

// Rutas para clientes
router.get('/mis-reservas', authorize([ROLES.CLIENTE]), cacheMiddleware(), getReservasDelCliente);

// Rutas para administradores y empleados
router.get('/', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservas);

// Ruta para que un cliente cree una reserva (incluye subida de archivo)
router.post(
    '/', 
    authorize([ROLES.CLIENTE]), 
    createReservaValidation,
    // Aplica Multer justo antes del controlador
    uploadComprobante.single('comprobante'), 
    createReservaConComprobante
);

// Rutas específicas por ID
router.get('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservaById);

router.put('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), updateReservaValidation, updateReserva);

// Rutas solo para administradores
router.delete('/:id', authorize([ROLES.ADMIN]), deleteReserva);

// Rutas de reportes y estadísticas (solo admin)
router.get('/estadisticas', authorize([ROLES.ADMIN]), cacheMiddleware(), estadisticasReservas);

router.get('/:id/pdf', authorize([ROLES.ADMIN]), generarReportePDF);

router.get('/csv', authorize([ROLES.ADMIN]), generarReporteCSV);

export default router;