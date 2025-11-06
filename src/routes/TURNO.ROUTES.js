import { Router } from 'express';
import { getTurnos, getTurno, createTurno, updateTurno, deleteTurno } from '../controllers/turno.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import { createTurnoValidation, updateTurnoValidation } from '../middlewares/turno.validation.js';

const router = Router();

const readRoles = [ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMIN];
const writeRoles = [ROLES.EMPLEADO, ROLES.ADMIN];

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar todos los turnos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos
 *       401:
 *         description: No autorizado
 */
router.get('/', verifyToken, authorize(readRoles), getTurnos);

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Ver turno por ID
 *     tags: [Turnos]
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
 *         description: Detalle del turno
 *       404:
 *         description: Turno no encontrado
 */
router.get('/:id', verifyToken, authorize(readRoles), getTurno);

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hora_desde
 *               - hora_hasta
 *             properties:
 *               hora_desde:
 *                 type: string
 *                 example: "15:00"
 *               hora_hasta:
 *                 type: string
 *                 example: "18:00"
 *     responses:
 *       201:
 *         description: Turno creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', verifyToken, authorize(writeRoles), createTurnoValidation, createTurno);

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Modificar un turno
 *     tags: [Turnos]
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
 *               hora_desde:
 *                 type: string
 *                 example: "16:00"
 *               hora_hasta:
 *                 type: string
 *                 example: "19:00"
 *     responses:
 *       200:
 *         description: Turno actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Turno no encontrado
 */
router.put('/:id', verifyToken, authorize(writeRoles), updateTurnoValidation, updateTurno);

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Eliminar un turno (soft delete)
 *     tags: [Turnos]
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
 *         description: Turno desactivado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Turno no encontrado
 */
router.delete('/:id', verifyToken, authorize(writeRoles), deleteTurno);

export default router;
