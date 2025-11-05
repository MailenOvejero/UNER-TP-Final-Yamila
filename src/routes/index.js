import { Router } from 'express';
import authRouter from './auth.routes.js'; // Rutas de Login/Auth
import salonRouter from './salon.routes.js'; // Importar el Router de Salones
import reservaRouter from './RESERVA.ROUTES.js';

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// PARA LA ENTREGA FINAL Y PODER PROBAR EN POSTAMAN, DESCOMENTO ESTAS DOS LINESS!!! 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import servicioRouter from './SERVICIO.ROUTES.js';
import turnoRouter from './TURNO.ROUTES.js';

const apiRouter = Router();

// ===============================================
// RUTAS MÓDULO AUTH
// Resultado: POST /api/auth/login
// También incluye /api/auth/test-email para probar envío de correo
// ===============================================
apiRouter.use('/auth', authRouter);

// ===============================================
// RUTAS PROTEGIDAS DE ENTIDADES (Persona 2)
// El prefijo '/api' se define en app.js.
// Resultado: /api/salones, /api/servicios, etc.
// ===============================================
apiRouter.use('/salones', salonRouter); // Montar el router de Salones bajo '/salones'

// Ejemplo para futuras entidades
apiRouter.use('/servicios', servicioRouter); 
apiRouter.use('/turnos', turnoRouter);       
apiRouter.use('/reservas', reservaRouter);

export default apiRouter;
