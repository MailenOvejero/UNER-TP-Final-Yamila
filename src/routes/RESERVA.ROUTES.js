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

/**
 * @swagger
 * paths:
 * /reservas/mis-reservas:
 * get:
 * summary: Ver reservas del cliente autenticado
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Lista de reservas del cliente
 * '401':
 * description: No autorizado
 */
router.get('/mis-reservas', authorize([ROLES.CLIENTE]), cacheMiddleware(), getReservasDelCliente);

/**
 * @swagger
 * paths:
 * /reservas:
 * get:
 * summary: Ver todas las reservas (admin y empleado)
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Lista de todas las reservas
 * '401':
 * description: No autorizado
 */
router.get('/', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservas);

/**
 * @swagger
 * paths:
 * /reservas:
 * post:
 * summary: Crear una nueva reserva con comprobante de pago (cliente)
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * required:
 * - fecha_reserva
 * - salon_id
 * - usuario_id
 * - turno_id
 * - importe_salon
 * - servicios
 * - comprobante
 * properties:
 * fecha_reserva:
 * type: string
 * example: "2025-11-10"
 * salon_id:
 * type: integer
 * example: 1
 * usuario_id:
 * type: integer
 * example: 2
 * turno_id:
 * type: integer
 * example: 1
 * importe_salon:
 * type: number
 * example: 5000
 * servicios:
 * type: string
 * example: '[{"servicio_id": 1, "importe": 1500}]'
 * description: JSON stringificado de servicios
 * comprobante:
 * type: string
 * format: binary
 * description: PDF o imagen del comprobante
 * responses:
 * '201':
 * description: Reserva creada
 * '400':
 * description: Datos inválidos o comprobante faltante
 * '401':
 * description: No autorizado
 */
router.post(
    '/', 
    authorize([ROLES.CLIENTE]), 
    createReservaValidation,
    // Aplica Multer justo antes del controlador
    uploadComprobante.single('comprobante'), 
    createReservaConComprobante
);

/**
 * @swagger
 * paths:
 * /reservas/{id}:
 * get:
 * summary: Ver una reserva por ID
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * responses:
 * '200':
 * description: Detalles de la reserva
 * '401':
 * description: No autorizado
 * '404':
 * description: Reserva no encontrada
 */
router.get('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservaById);

/**
 * @swagger
 * paths:
 * /reservas/{id}:
 * put:
 * summary: Actualizar una reserva
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * estado:
 * type: integer
 * description: Nuevo estado de la reserva (ej. 1=Confirmada, 2=Cancelada)
 * responses:
 * '200':
 * description: Reserva actualizada
 * '400':
 * description: Datos inválidos
 * '401':
 * description: No autorizado
 */
router.put('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), updateReservaValidation, updateReserva);

/**
 * @swagger
 * paths:
 * /reservas/{id}:
 * delete:
 * summary: Desactivar (soft delete) una reserva
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * responses:
 * '200':
 * description: Reserva desactivada
 * '401':
 * description: No autorizado
 * '404':
 * description: Reserva no encontrada
 */
router.delete('/:id', authorize([ROLES.ADMIN]), deleteReserva);

/**
 * @swagger
 * paths:
 * /reservas/estadisticas:
 * get:
 * summary: Ver estadísticas de reservas por mes
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Estadísticas mensuales
 * '401':
 * description: No autorizado
 */
router.get('/estadisticas', authorize([ROLES.ADMIN]), cacheMiddleware(), estadisticasReservas);

/**
 * @swagger
 * paths:
 * /reservas/{id}/pdf:
 * get:
 * summary: Descargar PDF de una reserva
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: integer
 * responses:
 * '200':
 * description: PDF generado
 * content:
 * application/pdf:
 * schema:
 * type: string
 * format: binary
 * '401':
 * description: No autorizado
 * '404':
 * description: Reserva no encontrada
 */
router.get('/:id/pdf', authorize([ROLES.ADMIN]), generarReportePDF);

/**
 * @swagger
 * paths:
 * /reservas/csv:
 * get:
 * summary: Descargar CSV de todas las reservas
 * tags: [Reservas]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Archivo CSV generado
 * content:
 * text/csv:
 * schema:
 * type: string
 * format: binary
 * '401':
 * description: No autorizado
 */
router.get('/csv', authorize([ROLES.ADMIN]), generarReporteCSV);

export default router;