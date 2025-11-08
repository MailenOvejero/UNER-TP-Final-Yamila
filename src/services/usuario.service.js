// /src/services/usuario.service.js

import { 
    getAllUsuarios, // NUEVO: Importar la función para obtener todos los usuarios
    obtenerEmailsAdministradores,
    getUserByUsername,
    verifyPassword,
    createUsuario // NUEVO: Importar la función de creación
} from '../data/usuario.data.js';

import { ROLES } from '../config/roles.js'; // NUEVO: Importar los roles (para asignar el 3)

/**
 * Servicio para obtener todos los usuarios desde la capa de datos.
 * @returns {Promise<Array>} Una promesa que resuelve a un array de usuarios.
 */
export const getAll = async () => {
    // Llama a la función de la capa de datos para obtener los usuarios
    const usuarios = await getAllUsuarios();
    return usuarios;
};

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


// ===============================================================
// NUEVA FUNCIÓN: Registro de Cliente
// ===============================================================

/**
 * Registra un nuevo usuario asegurando que el rol sea CLIENTE (3).
 * @param {object} userData - Datos del cliente a registrar.
 * @returns {object} El nuevo usuario creado (solo ID).
 */
export const registerClient = async (userData) => {
    // 1. Verificar si el nombre_usuario (email) ya existe
    const existingUser = await getUserByUsername(userData.nombre_usuario);
    if (existingUser) {
        const error = new Error('El nombre de usuario (email) ya está registrado.');
        error.status = 409; // Conflict (Recurso ya existe)
        throw error;
    }

    // 2. Asignar el tipo_usuario CLIENTE (3)
    const clientData = {
        ...userData,
        tipo_usuario: ROLES.CLIENTE || 3, // Asignamos el ID 3
        activo: 1, // Asumo que los clientes se registran como activos
    };

    // 3. Delegar la creación a la capa de datos (que se encarga del hashing)
    const newClient = await createUsuario(clientData);
    return newClient; // Retorna { usuario_id: insertId }
};