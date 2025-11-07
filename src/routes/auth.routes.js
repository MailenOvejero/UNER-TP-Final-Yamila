import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Ruta pública para el inicio de sesión
/**
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
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
 *                 example: alopez
 *               password:
 *                 type: string
 *                 example: 1234
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
 *                       example: alopez
 *                     role:
 *                       type: string
 *                       example: CLIENTE
 *       400:
 *         description: Faltan credenciales
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginRateLimiter, login);

// Ruta de prueba para envío de correo
router.get('/test-email', async (req, res) => {
  try {
    await enviarNotificacionReserva({
      destinatario: 'yamilamailenovejero27@gmail.com',
      asunto: 'Prueba de envío desde API',
      mensaje: 'Este es un correo de prueba enviado desde tu backend usando nodemailer.',
    });

    res.status(200).json({ mensaje: 'Correo enviado correctamente ' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Falló el envío de correo ' });
  }
});

export default router;
