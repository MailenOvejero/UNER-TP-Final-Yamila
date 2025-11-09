export const notFound = (req, res) => {
    res.status(404).send('404 - Recurso solicitado no encontrado');
};