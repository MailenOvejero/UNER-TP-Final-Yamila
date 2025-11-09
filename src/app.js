// src/app.js
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

// IMPORTAMOS EL ROUTER PÚBLICO (para páginas HTML estáticas)
import publicRouter from './routes/public.routes.js';

// IMPORTAMOS MIDDLEWARES DE SEGURIDAD Y CIERRE
import { verifyToken } from './middlewares/auth.middleware.js';
import { notFound, errorHandler } from './middlewares/index.js';

// Para servir archivos estáticos
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ************************************************************
// CONFIGURACIÓN
// ************************************************************

// Settings de aplicación
app.set('host', process.env.HOST || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');
app.set('env', process.env.NODE_ENV || 'development');

// seguridad
app.use(helmet());

// ************************************************************
// MIDDLEWARES GLOBALES (Orden Lógico de Ejecución)
// ************************************************************

// Logging
const morganMiddleware = setupLogging(app.get('env'));

// Rendimiento
app.use(compression());

// Seguridad de dominios
app.use(cors());

// Body parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ************************************************************
// DOCUMENTACIÓN SWAGGER
// ************************************************************
setupSwagger(app); // Se monta antes del middleware JWT

// ************************************************************
// RUTAS PÚBLICAS (Páginas HTML - sin autenticación)
// ************************************************************
// Montar el router público ANTES del middleware de autenticación
// Esto permite acceder a /login, /, etc. sin token
// IMPORTANTE: Debe ir antes de express.static para que las rutas tengan prioridad
app.use(publicRouter);

// ************************************************************
// ARCHIVOS ESTÁTICOS (Públicos - sin autenticación)
// ************************************************************
// Servir archivos estáticos de la carpeta public (CSS, JS, imágenes, etc.)
// Se monta después del router público para que las rutas del router tengan prioridad
// pero los archivos estáticos (CSS, JS, imágenes) se sirvan correctamente
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// ************************************************************
// MIDDLEWARE DE AUTENTICACIÓN (JWT Check)
// ************************************************************
app.use((req, res, next) => {
  const isLogin = req.originalUrl.includes('/api/auth/login') && req.method === 'POST';
  const isSwagger = req.originalUrl.includes('/docs') || req.originalUrl.includes('/api-docs');
  const isTestEmail = req.originalUrl.includes('/api/auth/test-email') && req.method === 'GET';
  const isRegister = req.path === '/api/auth/register/client' && req.method === 'POST';

  // Excepciones: Login, Swagger, test-email y registro de cliente
  if (isLogin || isSwagger || isTestEmail || isRegister) {
    return next();
  }

  verifyToken(req, res, next); // todas las demás rutas requieren token
});

// ************************************************************
// RUTA CENTRAL DE LA API
// ************************************************************
app.use('/api', apiRouter);

// ************************************************************
// DEBUG: Mostrar todas las rutas registradas
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

// ************************************************************
// MIDDLEWARES DE CIERRE
// ************************************************************
app.use(notFound);    // Página personalizada de error 404
app.use(errorHandler);// Página personalizada de error 500

// ************************************************************
// INICIO DEL SERVIDOR ASÍNCRONO
// ************************************************************
async function startServer() {
  try {
    // Inicializar pool de la base de datos
    await initializeDbPool();

    // Ejecutar job de encuestas después de inicializar el pool
    const { iniciarJobEncuestas } = await import('./jobs/enviarEncuestas.job.js');
    iniciarJobEncuestas();

    // Iniciar Express
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
