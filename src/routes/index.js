import { Router } from 'express';
import authRouter from './auth.routes.js';
import usuarioRouter from './usuario.routes.js';

const router = Router();

// Monta el enrutador de autenticación en la ruta /auth
// Todas las rutas definidas en auth.routes.js tendrán el prefijo /api/auth
router.use('/auth', authRouter);
router.use('/usuarios', usuarioRouter);

// Aquí puedes añadir otros enrutadores (salones, servicios, etc.)

export default router;