import jwt from 'jsonwebtoken';
import { ROLES } from '../config/roles.js';

/*Middleware uno - Verifica el token JWT en el header de la peticion (Authorization: Bearer <token>).
  Si es vaalido, adjunta la informaci0n del usuario (req.user) y pasa a la siguiente función.
  Si es invalido, devuelve 401 Unauthorized.
 */
export const verifyToken = (req, res, next) => {
    //  Extraer el header de autorizacion
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Si no hay token o no tiene el formato 'Bearer <token>'
        const error = new Error('Acceso denegado. Token JWT no proporcionado o formato inválido.');
        error.status = 401; // Unauthorized
        return next(error);
    }

    //  Extraer el token (eliminar el prefijo 'Bearer ')
    const token = authHeader.split(' ')[1];

    try {
        // Verificar y decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adjuntar la informacion del usuario al objeto de la peticion (req)
        // Esto permite que las rutas sepan quién hizo la petición (req.user.id, req.user.role)
        req.user = decoded; 
        
        // Pasar al siguiente middleware o ruta
        next(); 

    } catch (err) {
        // Si el token expiró, es inválido o la firma es incorrecta
        const error = new Error('Token inválido o expirado.');
        error.status = 401; // Unauthorized
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
        // Asume que verifyToken ya se ejecutó y req.user existe.
        if (!req.user || !req.user.role) {
            // Este caso no debería ocurrir si verifyToken se ejecuta antes,
            // pero actúa como un fallback de seguridad.
            const error = new Error('Acceso denegado. No se encontró información de usuario.');
            error.status = 403; // Forbidden
            return next(error);
        }

        const userRole = req.user.role;

        // Comprobar si el rol del usuario está incluido en la lista de roles permitidos
        if (allowedRoles.includes(userRole)) {
            // El rol es válido, continuar
            next();
        } else {
            // El rol no tiene permiso para esta ruta
            const error = new Error('Acceso prohibido. Rol insuficiente para realizar esta acción.');
            error.status = 403; // Forbidden
            return next(error);
        }
    };
};