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
import { uploadComprobante } from '../middlewares/upload.middleware.js';

const router = Router();
router.use(verifyToken);

// ============================================================
// RUTAS CLIENTE
// ============================================================

/**
 * @swagger
 * /reservas/mis-reservas:
 *   get:
 *     summary: Obtiene todas las reservas del cliente autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del cliente
 *       401:
 *         description: Token inválido o expirado
 *       500:
 *         description: Error interno
 */
router.get(
  '/mis-reservas',
  authorize([ROLES.CLIENTE]),
  cacheMiddleware(),
  getReservasDelCliente
);

// ============================================================
// RUTAS ADMIN/EMPLEADO
// ============================================================

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtiene todas las reservas del sistema
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.get(
  '/',
  authorize([ROLES.ADMIN, ROLES.EMPLEADO]),
  cacheMiddleware(),
  getReservas
);

// ============================================================
// CREAR RESERVA (CLIENTE CON COMPROBANTE)
// ============================================================

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva (con comprobante)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-10"
 *               salon_id:
 *                 type: integer
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 example: 3
 *               turno_id:
 *                 type: integer
 *                 example: 2
 *               importe_salon:
 *                 type: number
 *                 example: 50000
 *               servicios:
 *                 type: string
 *                 description: JSON con servicios seleccionados
 *                 example: '[{"servicio_id":1,"importe":15000},{"servicio_id":2,"importe":10000}]'
 *               comprobante:
 *                 type: string
 *                 format: binary
 *                 description: Archivo comprobante de pago
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Faltan datos o comprobante
 *       500:
 *         description: Error interno
 */
router.post(
  '/',
  authorize([ROLES.CLIENTE]),
  createReservaValidation,
  uploadComprobante.single('comprobante'),
  createReservaConComprobante
);

// ============================================================
// REPORTES Y ESTADÍSTICAS
// ============================================================

/**
 * @swagger
 * /reservas/estadisticas:
 *   get:
 *     summary: Obtiene estadísticas generales de reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generadas
 *       500:
 *         description: Error interno
 */
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
 *     summary: Descarga todas las reservas en formato CSV
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
 *     summary: Descarga una reserva específica en formato CSV
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
 *         description: CSV generado
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
 *     summary: Descarga una reserva específica en formato PDF
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

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Obtiene una reserva por su ID
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
 *         description: Datos de la reserva
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno
 */
router.get('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservaById);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Modifica una reserva existente
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *               importe_total:
 *                 type: number
 *             example:
 *               fecha_reserva: "2025-11-20"
 *               estado: "confirmada"
 *               importe_total: 80000
 *     responses:
 *       200:
 *         description: Reserva modificada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno
 */
router.put('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), updateReservaValidation, updateReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Elimina una reserva por su ID
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
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno
 */
router.delete('/:id', authorize([ROLES.ADMIN]), deleteReserva);

export default router;
