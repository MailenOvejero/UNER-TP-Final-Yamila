import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Autentica un usuario y devuelve un token JWT.
 * @access  Public
 */
router.post('/login', loginRateLimiter, login);

export default router;