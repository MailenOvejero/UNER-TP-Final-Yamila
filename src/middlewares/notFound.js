/**
 * Middleware para manejar rutas no encontradas (404).
 * Debe colocarse después de todas las rutas.
 */
export const notFound = (req, res) => {
    res.status(404).send('404 - Recurso solicitado no encontrado');
};