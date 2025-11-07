import { Router } from 'express';
import {
  getReservas,
  getReservaById,
  getReservasDelCliente,
  createReserva,
  updateReserva,
  deleteReserva,
  estadisticasReservas,
  generarReportePDF,
  generarReporteCSV
} from '../controllers/RESERVA.CONTROLLER.js';

import { cacheMiddleware, apicacheInstance } from '../config/cache.js';

import {
  createReservaValidation,
  updateReservaValidation
} from '../middlewares/RESERVA.VALIDATION.js';

import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import { upload } from '../config/multer.config.js';


const router = Router();

//  Middleware de autenticación aplicado a todas las rutas de reservas
router.use(verifyToken);

/**
 * @swagger
 * /reservas/mis-reservas:
 *   get:
 *     summary: Ver reservas del cliente autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del cliente
 *       401:
 *         description: No autorizado
 */
router.get('/mis-reservas', authorize([ROLES.CLIENTE]), cacheMiddleware(), getReservasDelCliente);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Ver todas las reservas (admin y empleado)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *       401:
 *         description: No autorizado
 */
router.get('/', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), cacheMiddleware(), getReservas);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva (cliente)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_reserva
 *               - salon_id
 *               - usuario_id
 *               - turno_id
 *               - importe_salon
 *               - servicios
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 example: "2025-11-10"
 *               salon_id:
 *                 type: integer
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 example: 2
 *               turno_id:
 *                 type: integer
 *                 example: 1
 *               importe_salon:
 *                 type: number
 *                 example: 5000
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicio_id:
 *                       type: integer
 *                       example: 1
 *                     importe:
 *                       type: number
 *                       example: 1500
 *     responses:
 *       201:
 *         description: Reserva creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', authorize([ROLES.CLIENTE]), upload.single('foto_cumpleaniero'), createReservaValidation, createReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Modificar una reserva (solo admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               tematica:
 *                 type: string
 *               foto_cumpleaniero:
 *                 type: string
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Reserva modificada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */
router.put('/:id', authorize([ROLES.ADMIN]), updateReservaValidation, updateReserva);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva (soft delete, solo admin)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva desactivada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */
router.delete('/:id', authorize([ROLES.ADMIN]), deleteReserva);

/**
 * @swagger
 * /reservas/estadisticas:
 *   get:
 *     summary: Ver estadísticas de reservas por mes
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas mensuales
 *       401:
 *         description: No autorizado
 */
router.get('/estadisticas', authorize([ROLES.ADMIN]), cacheMiddleware(), estadisticasReservas);

/**
 * @swagger
 * /reservas/{id}/pdf:
 *   get:
 *     summary: Descargar PDF de una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF generado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reserva no encontrada
 */
router.get('/:id/pdf', authorize([ROLES.ADMIN]), cacheMiddleware(), generarReportePDF);

/**
 * @swagger
 * /reservas/csv:
 *   get:
 *     summary: Descargar CSV de todas las reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV generado
 *       401:
 *         description: No autorizado
 */
router.get('/csv', authorize([ROLES.ADMIN]), cacheMiddleware(), generarReporteCSV);

export default router;
