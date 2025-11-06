import { Router } from 'express';
import {
  getServicios,
  getServicio,
  createServicio,
  updateServicio,
  deleteServicio
} from '../controllers/servicio.controller.js';

import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import {
  createServicioValidation,
  updateServicioValidation
} from '../middlewares/servicio.validation.js';

const router = Router();

const readRoles = [ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMIN];
const writeRoles = [ROLES.EMPLEADO, ROLES.ADMIN];

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar todos los servicios
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 *       401:
 *         description: No autorizado
 */
router.get('/', verifyToken, authorize(readRoles), getServicios);

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Ver servicio por ID
 *     tags: [Servicios]
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
 *         description: Detalle del servicio
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/:id', verifyToken, authorize(readRoles), getServicio);

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un servicio adicional
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - importe
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: Animación infantil
 *               importe:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Servicio creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/', verifyToken, authorize(writeRoles), createServicioValidation, createServicio);

/**
 * @swagger
 * /servicios/{id}:
 *   put:
 *     summary: Modificar un servicio
 *     tags: [Servicios]
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
 *               descripcion:
 *                 type: string
 *                 example: Animación renovada
 *               importe:
 *                 type: number
 *                 example: 1800
 *     responses:
 *       200:
 *         description: Servicio actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/:id', verifyToken, authorize(writeRoles), updateServicioValidation, updateServicio);

/**
 * @swagger
 * /servicios/{id}:
 *   delete:
 *     summary: Eliminar un servicio (soft delete)
 *     tags: [Servicios]
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
 *         description: Servicio desactivado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/:id', verifyToken, authorize(writeRoles), deleteServicio);

export default router;
