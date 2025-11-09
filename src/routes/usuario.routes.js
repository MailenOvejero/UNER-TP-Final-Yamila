import { Router } from 'express';
import {
  getUsuarios, getUsuarioById, createUsuario,
  updateUsuario, deleteUsuario
} from '../controllers/usuario.controller.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';
import {
  createUsuarioValidation,
  updateUsuarioValidation
} from '../middlewares/usuario.validation.js';
import { cacheMiddleware, apicacheInstance } from '../config/cache.js';


const router = Router();

// 🔒 ------ Todas las rutas de usuarios requieren token ------
router.use(verifyToken);

// 🔒 ------ Rutas que solo pueden acceder los administradores ------
router.use(authorize([ROLES.ADMIN]));

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
// 🔒 Ruta para listar usuarios (accesible por ADMIN y EMPLEADO)
router.get('/', 
  authorize([ROLES.ADMIN, ROLES.EMPLEADO]), 
  cacheMiddleware(), 
  getUsuarios
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Ver usuario por ID
 *     tags: [Usuarios]
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
 *         description: Usuario encontrado
 */
router.get('/:id', cacheMiddleware(), getUsuarioById);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - contrasenia
 *               - tipo_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               nombre_usuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               tipo_usuario:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', createUsuarioValidation, createUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Modificar usuario
 *     tags: [Usuarios]
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
 *         description: Usuario actualizado
 */
router.put('/:id', updateUsuarioValidation, updateUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (soft delete)
 *     tags: [Usuarios]
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
 *         description: Usuario desactivado
 */
router.delete('/:id', deleteUsuario);

export default router;
