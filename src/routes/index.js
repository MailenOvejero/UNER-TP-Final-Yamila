import { Router } from 'express';
import authRouter from './auth.routes.js'; // Rutas de Login/Auth
import salonRouter from './salon.routes.js'; // Importar el Router de Salones
import reservaRouter from './RESERVA.ROUTES.js';
import usuarioRoutes from './usuario.routes.js';
const apiRouter = Router();

apiRouter.use('/usuarios', usuarioRoutes);


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// PARA LA ENTREGA FINAL Y PODER PROBAR EN POSTAMAN, DESCOMENTO ESTAS DOS LINESS!!! 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
import servicioRouter from './SERVICIO.ROUTES.js';
import turnoRouter from './TURNO.ROUTES.js';


apiRouter.use('/auth', authRouter);

apiRouter.use('/salones', salonRouter); // Montar el router de Salones bajo '/salones'

// Ejemplo para futuras entidades
apiRouter.use('/servicios', servicioRouter); 
apiRouter.use('/turnos', turnoRouter);       
apiRouter.use('/reservas', reservaRouter);

export default apiRouter;
