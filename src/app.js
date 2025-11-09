import express from 'express';
import chalk from 'chalk';    // colores
import dotenv from 'dotenv';  // variables de entorno
import cors from 'cors';      // dominios múltiples y seguros
import compression from 'compression';  // compresión de datos
import { setupLogging } from './middlewares/logging.middleware.js';
import helmet from 'helmet';  // seguridad
import { setupSwagger } from './swagger.js';

// Determina el archivo a cargar basado en NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';
dotenv.config({ path: envFile });  // carga variables de entorno

// Importamos la función de inicialización del pool DEBE IR DESPUÉS de dotenv.config()
import { initializeDbPool } from './config/db.js';

// IMPORTAMOS EL ROUTER CENTRAL DE LA API
import apiRouter from './routes/index.js'; // Contiene /auth, /salones, /reservas, etc.

// IMPORTAMOS MIDDLEWARES DE SEGURIDAD Y CIERRE
import { verifyToken } from './middlewares/auth.middleware.js';
import { notFound, errorHandler } from './middlewares/index.js';

const app = express();


// -------- CONFIG --------

// Settings de aplicación
app.set('host', process.env.HOST || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');
app.set('env', process.env.NODE_ENV || 'development');

// -------- seguridad --------
app.use(helmet());


// -------- MIDDLEWARES GLOBALES (Respetar el Orden) --------

// Logging
const morganMiddleware = setupLogging(app.get('env'));

app.use(compression());

// Multiples dominios
app.use(cors());

// Body parsers, el urlencodded no lo llegamos a usar, pero lo dejamos
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));


// -------- DOCUMENTACIÓN SWAGGER --------

setupSwagger(app); // Va antes de  JWT


// RUTA test de bienvenida (Pública)

app.get("/", (req, res) => {
  const appName = app.get('app name');
  const version = app.get('version');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>${appName}</title></head>
      <body>
        <h1>${appName}</h1>
        <h2>Versión: ${version}</h2>
      </body>
    </html>
  `);
});


// MIDDLEWARE DE AUTENTICACIÓN (JWT Check) ->  usamos algunas excxepciones puntuales
// Si tuviera un front definido ya podriamos armar un ruter publico bien definido e incluirlas con nuevas funcionalidades

app.use((req, res, next) => {
  const isLogin = req.originalUrl.includes('/api/auth/login') && req.method === 'POST';
  const isSwagger = req.originalUrl.includes('/docs') || req.originalUrl.includes('/api-docs');
  const isTestEmail = req.originalUrl.includes('/api/auth/test-email') && req.method === 'GET';
  const isRegister = req.path === '/api/auth/register/client' && req.method === 'POST';

  // Excepciones: Login, Swagger, test-email y registro de cliente
  if (isLogin || isSwagger || isTestEmail || isRegister) {
    return next();
  }

  verifyToken(req, res, next); // el resto de las rutas requieren token
});

// -------- Nuestra RUTA CENTRAL -------- 
app.use('/api', apiRouter);

// ************************************************************
// -------- DEBUG: Ver todas las rutas registradas -------- 
// ************************************************************
if (app._router && app._router.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log('Ruta registrada:', r.route.path);
    } else if (r.name === 'router') {
      r.handle.stack.forEach((h) => {
        const route = h.route;
        if (route) console.log('Ruta registrada:', route.path);
      });
    }
  });
}


// -------- Manejo de errores con notificaciones por mail -------- 

app.use(notFound);    // Página personalizada de error 404
app.use(errorHandler);// Página personalizada de error 500


// -------- Con esto el server espera a que inicialice la DB para iniciar express --------
// -------- Se implemento asi porque en linux al iniciar la DB manualmente si uno se olvidaba habia error -------
// -------- Podemos decir que es una mejora, esto podria pasar si la DB estuviera lojada en otro server -------

async function startServer() {
  try {
    await initializeDbPool();

    // Ejecutamos el job de encuestas inmediatamente después de inicializar el pool de la DB!
    const { iniciarJobEncuestas } = await import('./jobs/enviarEncuestas.job.js');
    iniciarJobEncuestas();
    const { iniciarJobRecordatorios } = await import('./jobs/recordatorioReservas.job.js');
    iniciarJobRecordatorios();


    // Iniciamos Express normalmente
    app.listen(app.get('port'), app.get('host'), (error) => {
      if (error) throw error;
      console.log(chalk.green.italic(`\n\u2714 Server Express: V5.1.0 - ONLINE\n\n\u2714 IP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`));
    });
  } catch (error) {
    console.error(chalk.red.bold('Fallo al iniciar el servidor o la base de datos.'), error);
    process.exit(1);
  }
}

// Llamada a la función de inicio
startServer();
