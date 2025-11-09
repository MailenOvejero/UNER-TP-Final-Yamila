
import { enviarNotificacionReserva } from '../utils/email.helper.js';
import { obtenerEmailsAdmins } from '../services/usuario.service.js';


export const errorHandler = async (err, req, res, next) => {

    //  evito que si se enviaron cabeceras no se envien denuevo
    if (res.headersSent) {
        return next(err);
    }

    const env = req.app.get('env');

    const statusCode = err.status || 500;
    
    // Logica para mostrar detalles del error: solo en desarrollo o debug
    let errorDetails = {};

    if (env === 'development' || env === 'debug') {
        console.error(err.stack); // .stack da el erro con mas info
      
        errorDetails = {
            stack: err.stack,
            type: err.name,
            code: err.code 
        };      
    }

    //  notificamos x mail a los adminis activos
    try {
        const destinatarios = await obtenerEmailsAdmins();
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
