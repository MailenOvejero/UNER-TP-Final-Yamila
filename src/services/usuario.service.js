import {
    getAllUsuarios, 
    obtenerEmailsAdministradores,
    getUserByUsername,
    verifyPassword,
    createUsuario,
    softDeleteUsuario,
    updateUsuario,
    getUsuarioById
} from '../data/usuario.data.js';

import { ROLES } from '../config/roles.js'; //

/**
 * Servicio para obtener todos los usuarios desde la capa de datos.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de usuarios.
 */
export const getAll = async () => {
    // llamo a la f( de la capa de datos) -> para obtener los usuarios
    const usuarios = await getAllUsuarios();
    return usuarios;
};

// ------- Funciones de Autenticación ------ (para auth.controller.js)

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
    // Si el hash no existe (xej: si el usuario se encontro pero el campo es NULL)  
    // => retorna false para evitar que .startsWith() de error.
    if (!userHashedPassword) {
        return false;
    }

    // Llame a la capa de datos para hacer la comparación (y la migración de hash)
    return await verifyPassword(passwordPlana, userHashedPassword, userId);
}

/**
 * Obtiene los emails de todos los usuarios administradores activos.
 */
export const obtenerEmailsAdmins = async () => {
    return await obtenerEmailsAdministradores();
}


// ------ Extra f( Registro de Cliente ) ------

/**
 * Registra el nuevo usuario SIEMPRE asegurando que el rol sea CLIENTE (3).
 * @param {object} userData - Datos del cliente a registrar.
 * @returns {object} El nuevo usuario creado (solo ID).
 */
export const registerClient = async (userData) => {

    const existingUser = await getUserByUsername(userData.nombre_usuario);
    if (existingUser) {
        const error = new Error('El nombre de usuario (email) ya está registrado.');
        error.status = 409; // Conflict (Recurso ya existe)
        throw error;
    }

    const clientData = {
        ...userData,
        tipo_usuario: ROLES.CLIENTE || 3, // Asignamos el ID 3
        activo: 1, // Los registramos como activos
    };

    // Creamos el hasg desde la capa de datos
    const newClient = await createUsuario(clientData);
    return newClient; // => { usuario_id: insertId }
};


// ------ Obtener usuario por ID ------- (para el controller)
export const getUsuarioByIdService = async (id) => {
    return await getUsuarioById(id);
};


// Actualizar usuario (para controller)
export const update = async (id, data) => {
    // Llama a la f(de la capa de datos)
    return await updateUsuario(id, data);
};


// Baja lógica (desactivar usuario) (para controller)
export const softDelete = async (id) => {
    return await softDeleteUsuario(id);
};
