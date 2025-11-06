
import { enviarNotificacionReserva } from '../utils/email.helper.js';
import { obtenerEmailsAdministradores } from '../services/usuario.service.js';

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

    //  Enviar notificación por mail a administradores activos
    try {
        const destinatarios = await obtenerEmailsAdministradores();
        const asunto = `Error ${statusCode} en ${req.method} ${req.originalUrl}`;
        const mensaje = `
            <h3>Se ha producido un error en el sistema</h3>
            <ul>
                <li><strong>Ruta:</strong> ${req.originalUrl}</li>
                <li><strong>Método:</strong> ${req.method}</li>
                <li><strong>Usuario:</strong> ${req.user?.nombre_usuario || 'No autenticado'}</li>
                <li><strong>Mensaje:</strong> ${err.message}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString()}</li>
            </ul>
            ${env !== 'production' ? `<pre>${err.stack}</pre>` : ''}
        `;
        for (const email of destinatarios) {
            await enviarNotificacionReserva({ destinatario: email, asunto, mensaje });
        }
    } catch (mailError) {
        console.error('Error al enviar notificación por mail:', mailError.message);
    }


    res.status(statusCode).json({
        status:'error',
        message: err.message || 'Error Interno del Servidor',
        ...errorDetails 
    });
};
