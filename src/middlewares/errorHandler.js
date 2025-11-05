/**
 * Middleware de manejo de errores (500), se distingue por tener 4 argumentos.
 * Debe colocarse el último de todos los middlewares, después de las rutas y del 404.
 */
export const errorHandler = (err, req, res, next) => {

    //  Evita que si se enviaron cabeceras no se envien denuevo crasheando el server
    if (res.headersSent) {
        return next(err);
    }
    //  Obtener el entorno configurado por la línea app.set('env', ...)
    const env = req.app.get('env');

    //  Define el estado HTTP (usa 500 si no está especificado en el error)
    const statusCode = err.status || 500;
    
    // Logica para mostrar detalles del error: solo en desarrollo o debug
    let errorDetails = {}; // Inicializamos como objeto vacío

    if (env === 'development' || env === 'debug') {
        console.error(err.stack); // Usar err.stack da info completa del error
        
        // Incluimos el stack y otros detalles en la respuesta JSON
        errorDetails = {
            stack: err.stack,
            type: err.name,
            code: err.code 
        };      
    }

    //  Envía la respuesta con el estado HTTP y los detalles (solo si no estamos en producción)
    res.status(statusCode).json({
        status:'error',
        message: err.message || 'Error Interno del Servidor',
        ...errorDetails // Usar spread operator para incluir solo las propiedades si existen
    });
}