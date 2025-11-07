// src/routes/auth.routes.js
import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: [] # pública (sin JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - password
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: alblopo@correo.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Autenticación exitosa
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: alblopo
 *                     role:
 *                       type: string
 *                       example: CLIENTE
 *       400:
 *         description: Faltan credenciales
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginRateLimiter, login);

export default router;
