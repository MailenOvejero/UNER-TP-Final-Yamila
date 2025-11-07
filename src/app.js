// ************************************************************
// CARGA DE VARIABLES DE ENTORNO (.env.development o .env.production)
// ************************************************************
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import path from 'path';
import dotenv from 'dotenv';

// Detecta si estamos en entorno de producción o desarrollo
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

// Carga las variables desde el archivo correspondiente (desde raíz del proyecto)
dotenv.config({ path: path.join(__dirname, envFile) });



// Verifica que las variables se hayan cargado correctamente
console.log('[ENVIRONMENT] Archivo cargado:', envFile);
console.log('[EMAIL SERVICE] Configuración SMTP:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '***' : undefined,
});

// ************************************************************
// IMPORTACIÓN DE DEPENDENCIAS PRINCIPALES
// ************************************************************
import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { setupLogging } from './middlewares/logging.middleware.js';
import { setupSwagger } from './swagger.js';
import { initializeDbPool } from './config/db.js';
import { verifyToken } from './middlewares/auth.middleware.js';
import { notFound, errorHandler } from './middlewares/index.js';

// ************************************************************
// IMPORTACIÓN DE RUTAS
// ************************************************************
import apiRouter from './routes/index.js';
import authRouter from './routes/auth.routes.js';
import usuarioRouter from './routes/usuario.routes.js';

// ************************************************************
// CONFIGURACIÓN DE LA APP
// ************************************************************
const app = express();

app.set('host', process.env.HOST || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('app name', 'API Rest');
app.set('version', '1.0.0');
app.set('env', process.env.NODE_ENV || 'development');

// Seguridad HTTP
app.use(helmet());

// ************************************************************
// MIDDLEWARES GLOBALES
// ************************************************************
const morganMiddleware = setupLogging(app.get('env'));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ************************************************************
// DOCUMENTACIÓN SWAGGER
// ************************************************************
setupSwagger(app);

// ************************************************************
// RUTA DE BIENVENIDA (PÚBLICA)
// ************************************************************
app.get("/", (req, res) => {
  const appName = app.get('app name');
  const version = app.get('version');

  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>${appName}</title></head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>${appName}</h1>
        <h2>Versión: ${version}</h2>
        <p>Servidor activo en modo: <strong>${app.get('env')}</strong></p>
      </body>
    </html>
  `);
});

// ************************************************************
// RUTAS PÚBLICAS
// ************************************************************
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuarioRouter);

// ************************************************************
// MIDDLEWARE DE AUTENTICACIÓN (JWT)
// ************************************************************
app.use((req, res, next) => {
  if (req.path.startsWith('/api/auth') || req.path.startsWith('/docs')) {
    return next();
  }
  verifyToken(req, res, next);
});

// ************************************************************
// RUTAS PRIVADAS
// ************************************************************
app.use('/api', apiRouter);

// ************************************************************
// DEPURACIÓN DE RUTAS REGISTRADAS
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
app.use(notFound);
app.use(errorHandler);

// ************************************************************
// INICIO DEL SERVIDOR ASÍNCRONO
// ************************************************************
async function startServer() {
  try {
    await initializeDbPool();

    app.listen(app.get('port'), app.get('host'), (error) => {
      if (error) throw error;

      console.log(
        chalk.green.italic(
          `\n\u2714 Server Express: V5.1.0 - ONLINE\n\n\u2714 IP:${app.get('host')}:${app.get('port')} - Mode: ${process.env.NODE_ENV}\n`
        )
      );
    });
  } catch (error) {
    console.error(chalk.red.bold('Fallo al iniciar el servidor o la base de datos:'), error);
    process.exit(1);
  }
}

startServer();
