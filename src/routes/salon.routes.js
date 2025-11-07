import { Router } from 'express';
import {
    getSalones,
    getSalon,
    createSalon,
    updateSalon,
    deleteSalon
} from '../controllers/salon.controller.js';
import { authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../config/roles.js';

const router = Router();

// Suponiendo roles para cada acción
router.get('/', authorize([ROLES.ADMIN, ROLES.EMPLEADO, ROLES.CLIENTE]), getSalones);
router.get('/:id', authorize([ROLES.ADMIN, ROLES.EMPLEADO, ROLES.CLIENTE]), getSalon);
router.post('/', authorize([ROLES.ADMIN]), createSalon); // Solo admin puede crear
router.put('/:id', authorize([ROLES.ADMIN]), updateSalon); // Solo admin puede editar
router.delete('/:id', authorize([ROLES.ADMIN]), deleteSalon); // Solo admin puede borrar

export default router;