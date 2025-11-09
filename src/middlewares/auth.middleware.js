import jwt from 'jsonwebtoken';
import { ROLES } from '../config/roles.js';

/*Verifico el token JWT el formato es Bearer <token>).
  Si = vaalido => adjunta la info de usuario (req.user) => siguiente función.
  Si es invalido => 401 Unauthorized.
 */
export const verifyToken = (req, res, next) => {
    //  Extraer el header aut
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Chequeamos si hay y el formato 'Bearer <token>'
        const error = new Error('Acceso denegado. Token JWT no proporcionado o formato inválido.');
        error.status = 401; // no autoriza
        return next(error);
    }

    //  Extrae el token y elimina el prefijo 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
        // Verifico y decodifico el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // sumo la info del user a la peticion para poder reconocerlo (req.user.id, req.user.role)
        req.user = decoded; 
        
        // => siguiente middleware o ruta
        next(); 

    } catch (err) {
        // puede ser invalido, expirado, o incorrecto
        const error = new Error('Token inválido o expirado.');
        error.status = 401; 
        return next(error);
    }
};

/**
 * Middleware dos - Verifica que el rol del usuario (adjunto en req.user)
 * sea uno de los roles permitidos para acceder a la ruta.
 * * Es una función "wrapper" que recibe los roles permitidos y devuelve el middleware.
 * @param {Array<number>} allowedRoles - Array de IDs de roles permitidos (ej. [ROLES.ADMIN, ROLES.EMPLEADO]).
 */
export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        // Asumo que verifyToken ya se ejecutó y req.user existe.
        if (!req.user || !req.user.role) {
            // no debería ocurrir si verifyToken se ejecuta antes,
            // es fallback de seguridad.
            const error = new Error('Acceso denegado. No se encontró información de usuario.');
            error.status = 403; // Forbidden
            return next(error);
        }

        const userRole = req.user.role;

        // compruebo que el rol este permitido en el listado
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            const error = new Error('Acceso prohibido. Rol insuficiente para realizar esta acción.');
            error.status = 403; 
            return next(error);
        }
    };
};
