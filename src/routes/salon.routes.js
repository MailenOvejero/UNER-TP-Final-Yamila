import { Router } from 'express';
import { getSalones, getSalon, createSalon, updateSalon, deleteSalon } from '../controllers/salon.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import { createSalonValidation, updateSalonValidation } from '../middlewares/salon.validation.js';

const router = Router();
const readRoles = [ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMIN];
const writeRoles = [ROLES.EMPLEADO, ROLES.ADMIN];

/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Crear un salón
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - direccion
 *               - capacidad
 *               - importe
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Salón Azul
 *               direccion:
 *                 type: string
 *                 example: Calle Falsa 123
 *               capacidad:
 *                 type: integer
 *                 example: 50
 *               importe:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Salón creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', verifyToken, authorize(writeRoles), createSalonValidation, createSalon);

/**
 * @swagger
 * /salones/{id}:
 *   put:
 *     summary: Modificar un salón
 *     tags: [Salones]
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
 *               titulo:
 *                 type: string
 *                 example: Salón Verde
 *               direccion:
 *                 type: string
 *                 example: Calle Real 456
 *               capacidad:
 *                 type: integer
 *                 example: 80
 *               importe:
 *                 type: number
 *                 example: 7000
 *     responses:
 *       200:
 *         description: Salón actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Salón no encontrado
 */
router.put('/:id', verifyToken, authorize(writeRoles), updateSalonValidation, updateSalon);

/**
 * @swagger
 * /salones/{id}:
 *   delete:
 *     summary: Eliminar un salón (soft delete)
 *     tags: [Salones]
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
 *         description: Salón desactivado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Salón no encontrado
 */
router.delete('/:id', verifyToken, authorize(writeRoles), deleteSalon);

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Listar todos los salones
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salones
 *       401:
 *         description: No autorizado
 */
router.get('/', verifyToken, authorize(readRoles), getSalones);

/**
 * @swagger
 * /salones/{id}:
 *   get:
 *     summary: Ver salón por ID
 *     tags: [Salones]
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
 *         description: Detalle del salón
 *       404:
 *         description: Salón no encontrado
 */
router.get('/:id', verifyToken, authorize(readRoles), getSalon);

export default router;
