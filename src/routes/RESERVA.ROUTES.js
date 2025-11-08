import { Router } from 'express';
import {
  getReservas,
  getReservaById,
  getReservasDelCliente,
  createReserva as createReservaConComprobante, 
  updateReserva,
  deleteReserva,
  estadisticasReservas,
  generarReportePDF,
  descargarCSVReservas,        
  descargarCSVReservaPorId 
} from '../controllers/RESERVA.CONTROLLER.js';

import {
  createReservaValidation,
  updateReservaValidation
} from '../middlewares/RESERVA.VALIDATION.js';

import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import { cacheMiddleware } from '../config/cache.js';

// Instancia Multer para comprobantes
import { uploadComprobante } from '../middlewares/upload.middleware.js'; 

const router = Router();

// Middleware de autenticación aplicado a todas las rutas
router.use(verifyToken);

// ============================================================
// RUTAS PARA CLIENTES
// ============================================================
router.get(
  '/mis-reservas',
  authorize([ROLES.CLIENTE]),
  cacheMiddleware(),
  getReservasDelCliente
);

// ============================================================
// RUTAS PARA ADMINISTRADORES Y EMPLEADOS
// ============================================================
router.get(
  '/',
  authorize([ROLES.ADMIN, ROLES.EMPLEADO]),
  cacheMiddleware(),
  getReservas
);

// ============================================================
// CREAR RESERVA (CLIENTE CON COMPROBANTE)
// ============================================================
router.post(
  '/',
  authorize([ROLES.CLIENTE]),
  createReservaValidation,
  uploadComprobante.single('comprobante'),
  createReservaConComprobante
);

// ============================================================
// RUTAS DE REPORTES Y ESTADÍSTICAS (ADMIN)
// ============================================================
router.get(
  '/estadisticas',
  authorize([ROLES.ADMIN]),
  cacheMiddleware(),
  estadisticasReservas
);

/**
 * @swagger
 * /reservas/csv:
 *   get:
 *     summary: Descarga todas las reservas en CSV
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV generado y descargado
 *       404:
 *         description: No hay reservas
 *       500:
 *         description: Error interno
 */
router.get('/csv', authorize([ROLES.ADMIN]), descargarCSVReservas);

/**
 * @swagger
 * /reservas/{id}/csv:
 *   get:
 *     summary: Descarga CSV de una sola reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV de la reserva
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id/csv', authorize([ROLES.ADMIN]), descargarCSVReservaPorId);

/**
 * @swagger
 * /reservas/{id}/pdf:
 *   get:
 *     summary: Descarga PDF de una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF generado y descargado
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id/pdf', authorize([ROLES.ADMIN]), generarReportePDF);

// ============================================================
// RUTAS ESPECÍFICAS POR ID
// ============================================================


router.get('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservaById);
/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Modificar usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombre_usuario:
 *                 type: string
 *               celular:
 *                 type: string
 *               tipo_usuario:
 *                 type: integer
 *             example:
 *               nombre: Juan
 *               apellido: Pérez
 *               nombre_usuario: juanp
 *               celular: "1122334455"
 *               tipo_usuario: 2
 *     responses:
 *       200:
 *         description: Usuario modificado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), updateReservaValidation, updateReserva);
router.delete('/:id', authorize([ROLES.ADMIN]), deleteReserva);

export default router;
