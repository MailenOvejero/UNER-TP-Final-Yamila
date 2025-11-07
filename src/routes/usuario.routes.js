import { Router } from 'express';
import { createUser } from '../controllers/usuario.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con la gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     description: Permite registrar un nuevo usuario en el sistema. No requiere autenticación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Alberto"
 *               apellido:
 *                 type: string
 *                 example: "López"
 *               email:
 *                 type: string
 *                 example: "alblop@correo.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error en los datos enviados
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', createUser);

export default router;
