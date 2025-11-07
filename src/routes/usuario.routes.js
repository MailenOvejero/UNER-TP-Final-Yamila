import { Router } from 'express';
import { createUser } from '../controllers/usuario.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';

const router = Router();

/**
 * @route   POST /api/usuarios
 * @desc    Crea un nuevo usuario en el sistema.
 * @access  Private (Solo para Administradores)
 */
router.post('/',
    authorize([ROLES.ADMIN]), // Solo los usuarios con rol de ADMIN pueden acceder
    createUser
);

export default router;