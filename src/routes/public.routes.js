import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

export default router;

