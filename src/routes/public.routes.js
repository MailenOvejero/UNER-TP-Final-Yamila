import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, registerClientController } from '../controllers/auth.controller.js';
import { createUsuarioValidation } from '../middlewares/usuario.validation.js';

const router = Router();

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ruta pública para servir la página de login
 * GET /login o GET /
 */
router.get('/', (req, res) => {
  const publicPath = path.join(__dirname, '../../public');
  res.sendFile(path.join(publicPath, 'index.html'));
});

router.get('/login', (req, res) => {
  const publicPath = path.join(__dirname, '../../public');
  res.sendFile(path.join(publicPath, 'index.html'));
});

/**
 * Rutas para los dashboards (requieren autenticación del lado del cliente)
 */
router.get('/dashboard-admin.html', (req, res) => {
  const publicPath = path.join(__dirname, '../../public');
  res.sendFile(path.join(publicPath, 'dashboard-admin.html'));
});

router.get('/dashboard-empleado.html', (req, res) => {
  const publicPath = path.join(__dirname, '../../public');
  res.sendFile(path.join(publicPath, 'dashboard-empleado.html'));
});

router.get('/dashboard-cliente.html', (req, res) => {
  const publicPath = path.join(__dirname, '../../public');
  res.sendFile(path.join(publicPath, 'dashboard-cliente.html'));
});

/**
 * Ruta POST /login - Procesa el formulario de login
 * Captura los datos del formulario y los envía al controlador de autenticación
 */
router.post('/login', async (req, res, next) => {
  try {
    // Los datos vienen del formulario (nombre_usuario y password)
    await login(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * Ruta POST /register - Procesa el formulario de registro
 * Usa validación antes de registrar el cliente
 */
router.post('/register', createUsuarioValidation, async (req, res, next) => {
  try {
    // Los datos vienen del formulario de registro
    // La validación ya se ejecutó en createUsuarioValidation
    await registerClientController(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;

