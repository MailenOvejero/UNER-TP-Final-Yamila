import { Router } from 'express';
import { login, registerClientController } from '../controllers/auth.controller.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js';

import {
  createUsuarioValidation,
} from '../middlewares/usuario.validation.js';


const router = Router();

// Ruta pública para el inicio de sesión
/**
 * @swagger
 * paths:
 *   /auth/login:
 *     post:
 *       summary: Iniciar sesión
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - nombre_usuario
 *                 - password
 *               properties:
 *                 nombre_usuario:
 *                   type: string
 *                   example: alopez@correo.com
 *                 password:
 *                   type: string
 *                   example: 1234
 *       responses:
 *         '200':
 *           description: Autenticación exitosa (devuelve token y usuario).
 *         '400':
 *           description: Faltan credenciales.
 *         '401':
 *           description: Credenciales inválidas.
 */
router.post('/login', login);


// ===============================================================
// NUEVA RUTA PÚBLICA: Registro de Cliente (YAML Mínimo)
// ===============================================================
/**
 * @swagger
 * paths:
 *   /auth/register/client:
 *     post:
 *       summary: Registrar un nuevo usuario de tipo CLIENTE (ID 3)
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - nombre
 *                 - apellido
 *                 - nombre_usuario
 *                 - contrasenia
 *               properties:
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 nombre_usuario:
 *                   type: string
 *                 contrasenia:
 *                   type: string
 *                 celular:
 *                   type: string
 *                 foto:
 *                   type: string
 *       responses:
 *         '201':
 *           description: Cliente creado exitosamente.
 *         '400':
 *           description: Datos inválidos.
 *         '409':
 *           description: El nombre de usuario (email) ya está registrado.
 */
router.post(
    '/registro/cliente',
    createUsuarioValidation,
    registerClientController
);

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