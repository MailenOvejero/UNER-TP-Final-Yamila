// /src/services/usuario.service.js

import { 
    obtenerEmailsAdministradores,
    getUserByUsername,
    verifyPassword 
} from '../data/usuario.data.js';

// NOTA: Agregar aquí las funciones CRUD (getAllUsuarios, getUsuarioById, etc.)
// ... (Otras funciones CRUD) ...

// ===============================================================
// Funciones de Autenticación (Necesarias para auth.controller.js)
// ===============================================================

/**
 * Busca un usuario activo por su nombre de usuario (email).
 */
export const buscarUsuarioPorEmail = async (email) => {
    return await getUserByUsername(email); 
}

/**
 * Valida si una contraseña plana coincide con el hash almacenado,
 * y se encarga de la migración de hash si es necesario.
 */
export const validarPassword = async (passwordPlana, userHashedPassword, userId) => {
    // FIX: Si el hash no existe (ej. el usuario se encontró pero el campo es NULL), 
    // retorna false inmediatamente para evitar que .startsWith() falle.
    if (!userHashedPassword) {
        return false;
    }

    // Llama a la capa de datos para hacer la comparación (y la migración de hash)
    return await verifyPassword(passwordPlana, userHashedPassword, userId);
}

/**
 * Obtiene los emails de todos los usuarios administradores activos.
 */
export const obtenerEmailsAdmins = async () => {
    return await obtenerEmailsAdministradores();
}