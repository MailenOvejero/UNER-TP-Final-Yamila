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
  descargarCSVReservaPorId,
  agregarComentario,
  listarComentarios,
  agregarEncuesta,
  listarEncuestas,
  agregarComentarioConNotificacion,
  agregarEncuestaConNotificacion,
  listarTodasEncuestas,
  listarTodosComentarios,
  agregarInvitados,
  listarInvitadosReserva,
  actualizarInvitado,
  eliminarInvitado
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
 * /reservas/encuestas:
 *   get:
 *     summary: Listar todas las encuestas de satisfacción (solo admin/empleado)
 *     description: Muestra todas las encuestas completadas por clientes, ordenadas por fecha.
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de encuestas
 *       404:
 *         description: No hay encuestas registradas
 */
router.get('/encuestas', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), listarTodasEncuestas);
/**
// Clientes logueados pueden agregar invitados a sus reservas
/**
 * @swagger
 * /reservas/{reserva_id}/invitados:
 *   post:
 *     summary: Agregar uno o varios invitados a una reserva
 *     tags: [Invitados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   edad:
 *                     type: integer
 *                   email:
 *                     type: string
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     apellido:
 *                       type: string
 *                     edad:
 *                       type: integer
 *                     email:
 *                       type: string
 *     responses:
 *       201:
 *         description: Invitados agregados
 *       400:
 *         description: Datos inválidos
 */
router.post('/:reserva_id/invitados', authorize([ROLES.CLIENTE]), agregarInvitados);

/**
 * @swagger
 * /reservas/{reserva_id}/invitados:
 *   get:
 *     summary: Listar invitados de una reserva
 *     tags: [Invitados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Lista de invitados
 *       404:
 *         description: No se encontraron invitados
 */
router.get('/:reserva_id/invitados', authorize([ROLES.CLIENTE, ROLES.ADMIN, ROLES.EMPLEADO]), listarInvitadosReserva);

/**
 * @swagger
 * /reservas/{reserva_id}/invitados/{invitado_id}:
 *   put:
 *     summary: Actualizar datos de un invitado
 *     tags: [Invitados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reserva_id
 *         in: path
 *         required: true
 *         description: ID de la reserva a la que pertenece el invitado.
 *         schema:
 *           type: integer
 *       - name: invitado_id
 *         in: path
 *         required: true
 *         description: ID del invitado a actualizar.
 *         schema:
 *           type: integer
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
 *               edad:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invitado actualizado
 */
router.put('/:reserva_id/invitados/:invitado_id',authorize([ROLES.CLIENTE]), actualizarInvitado);

/**
 * @swagger
 * /reservas/{reserva_id}/invitados/{invitado_id}:
 *   delete:
 *     summary: Eliminar un invitado (soft delete)
 *     tags: [Invitados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reserva_id
 *         in: path
 *         required: true
 *         description: ID de la reserva a la que pertenece el invitado.
 *         schema:
 *           type: integer
 *       - name: invitado_id
 *         in: path
 *         required: true
 *         description: ID del invitado a eliminar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invitado eliminado
 */
router.delete('/:reserva_id/invitados/:invitado_id', authorize([ROLES.CLIENTE]), eliminarInvitado);


/**
 * @swagger
 * /reservas/{id}/encuestas:
 *   get:
 *     summary: Listar encuestas de una reserva específica (solo admin/empleado)
 *     description: Muestra las encuestas asociadas a una reserva concreta.
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
 *         description: Lista de encuestas de la reserva
 *       404:
 *         description: Reserva no encontrada
 */
router.get('/:id/encuestas', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), listarEncuestas);
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
 * /reservas/{id}/comentarios:
 *   post:
 *     summary: Agregar un comentario/observación a una reserva (admin)
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
 *               comentario:
 *                 type: string
 *                 example: "Pago 50% recibido. Cliente avisado."
 *     responses:
 *       201:
 *         description: Comentario agregado y notificado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 */
router.post('/:id/comentarios', authorize([ROLES.ADMIN]), agregarComentarioConNotificacion);

/**
 * @swagger
 * /reservas/{id}/comentarios:
 *   get:
 *     summary: Listar comentarios de una reserva (admin/empleado)
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
 *         description: Lista de comentarios
 *       404:
 *         description: Reserva no encontrada
 */
router.get('/:id/comentarios', authorize([ROLES.ADMIN, ROLES.EMPLEADO]), listarComentarios);

/**
 * @swagger
 * /reservas/{id}/encuestas:
 *   post:
 *     summary: Enviar encuesta de satisfacción (solo cliente dueño, después de la fecha)
 *     description: El cliente puede enviar una encuesta de satisfacción una vez finalizada su reserva.
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
 *               puntuacion:
 *                 type: integer
 *                 example: 5
 *               comentarios:
 *                 type: string
 *                 example: "Todo excelente, volvería!"
 *     responses:
 *       201:
 *         description: Encuesta guardada y notificada
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
router.post('/:id/encuestas', authorize([ROLES.CLIENTE]), agregarEncuestaConNotificacion);





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
