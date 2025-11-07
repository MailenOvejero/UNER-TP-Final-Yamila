import express from 'express';
import chalk from 'chalk';    // colores
import dotenv from 'dotenv';  // variable de entorno
import cors from 'cors';      // dominios multiples y seguros
import compression from 'compression';  // compresion de datos
import { setupLogging } from './middlewares/logging.middleware.js';
import helmet from 'helmet';  // seguridad
import { setupSwagger } from './swagger.js';


// Determina el archivo a cargar basado en NODE_ENV
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';
dotenv.config({ path: envFile });  // CARGA DE VARIABLES DE ENTORNO

// Importamos la función de inicialización del pool DEBE IR DESPUÉS de dotenv.config()
import { initializeDbPool } from './config/db.js';

// IMPORTAMOS EL ROUTER CENTRAL DE LA API
import { publicRouter, privateRouter } from './routes/index.js'; // Contiene /auth, /salones, etc.

// IMPORTAMOS MIDDLEWARES DE SEGURIDAD Y CIERRE
import { verifyToken } from './middlewares/auth.middleware.js';
import { notFound, errorHandler } from './middlewares/index.js';

const app = express();

// ************************************************************
// CONFIGURACIÓN
// ************************************************************

// Settings de aplicación: Usar variables de entorno para HOST y PORT
app.set('host', process.env.HOST || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');

// Settings de desarrollo
app.set('env', process.env.NODE_ENV || 'development');

// seguridad
app.use(helmet());

// ************************************************************
// MIDDLEWARES GLOBALES (Orden Lógico de Ejecución)
// ************************************************************

// - LOGGING
const morganMiddleware = setupLogging(app.get('env'));
// - RENDIMIENTO
app.use(compression());
// - SEGURIDAD DE DOMINIOS
app.use(cors());

// - BODY PARSERS - DEBEN IR ANTES DE CUALQUIER RUTA QUE USE req.body
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }))

// ************************************************************
// ZONA DE RUTAS DE LA APLICACIÓN
// ************************************************************

//  Documentación Swagger (debe cargarse antes del middleware JWT)
setupSwagger(app);

// RUTA DE BIENVENIDA (Pública y fuera del prefijo /api)
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
  `)
});

// RUTAS PÚBLICAS (No requieren token)
app.use('/api', publicRouter);

// MIDDLEWARE DE AUTENTICACIÓN (JWT Check) para rutas privadas
// CUALQUIER RUTA DEFINIDA DESPUÉS DE ESTA LÍNEA, REQUERIRÁ UN TOKEN VÁLIDO.
app.use(verifyToken);

// RUTAS PRIVADAS (Requieren token)
app.use('/api', privateRouter);
// DEBUG: Mostrar todas las rutas registradas en la app (solo si existen)
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

// ************************************************************
// MIDDLEWARES DE CIERRE (SIEMPRE AL FINAL)
// ************************************************************

app.use(notFound);    // Página personalizada de error 404
app.use(errorHandler);// Página personalizada de error 500

// ************************************************************
// INICIO DEL SERVIDOR ASÍNCRONO
// ************************************************************
async function startServer() {
  try {
    // a - INICIALIZAR EL POOL DE LA BASE DE DATOS (DEBE SER EL PRIMERO)
    // Esto garantiza que process.env.DB_NAME está disponible cuando se crea el pool.
    await initializeDbPool();

    // b - Iniciar Express
    app.listen(app.get('port'), app.get('host'), (error) => {

      if (error) {
        throw error;
      }
      // El mensaje ahora muestra la IP y el puerto correctos del .env
      console.log(chalk.green.italic(`\n\u2714 Server Express: V5.1.0 - ONLINE\n\n\u2714 IP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`));
    });

  } catch (error) {
    console.error(chalk.red.bold('Fallo al iniciar el servidor o la base de datos.'), error);
    process.exit(1);
  }
}

startServer();
