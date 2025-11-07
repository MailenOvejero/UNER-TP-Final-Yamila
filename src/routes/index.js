import { Router } from 'express';
import authRouter from './auth.routes.js';
import salonRouter from './salon.routes.js';
// Importa aquí otros routers que vayas creando (servicios, turnos, etc.)

const publicRouter = Router();
const privateRouter = Router();

// Rutas públicas (ej. login, registro, test-email)
publicRouter.use('/auth', authRouter);

// Rutas privadas (requieren token)
privateRouter.use('/salones', salonRouter);
// privateRouter.use('/servicios', servicioRouter);
// ... y así con el resto

export { publicRouter, privateRouter };