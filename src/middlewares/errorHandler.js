
import { getAdminEmails } from '../services/usuario.service.js';
import { sendEmailWithTemplate } from '../services/email.service.js';


export const errorHandler = async (err, req, res, next) => {

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

    //  Enviar notificación por mail a administradores solo si es un error del servidor (5xx)
    if (statusCode >= 500) {
        try {
            const destinatarios = await getAdminEmails();
            const asunto = `Alerta de Error ${statusCode} en ${req.method} ${req.originalUrl}`;
    
            // Objeto de datos para la plantilla
            const emailData = {
                statusCode,
                ruta: req.originalUrl,
                metodo: req.method,
                usuario: req.user?.nombre_usuario || 'No autenticado',
                mensaje: err.message,
                fecha: new Date().toLocaleString(),
                stack: (env !== 'production') ? err.stack : null
            };
    
            for (const email of destinatarios) {
                await sendEmailWithTemplate(
                    email,
                    asunto,
                    'errorNotificacion',
                    emailData
                );
            }
        } catch (mailError) {
            console.error('Error al enviar notificación de error por mail:', mailError.message);
        }
    }


    res.status(statusCode).json({
        status:'error',
        message: err.message || 'Error Interno del Servidor',
        ...errorDetails 
    });
};
