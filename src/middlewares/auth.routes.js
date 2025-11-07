import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Ruta de Login
// Se aplica el middleware de rate limiting ANTES del controlador.
router.post('/login', loginRateLimiter, authController.login);


export default router;