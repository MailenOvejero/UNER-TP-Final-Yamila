import { getDbPool } from '../config/db.js';
// Importación ajustada para encontrar el repositorio en src/data
import * as salonRepo from '../data/SALON.REPOSITORY.js';

/**
 * Obtiene todos los salones activos con opciones de paginación (Browse).
 * @param {object} options - Opciones de paginación (limit, offset, order, asc).
 * @returns {Promise<Array>} Lista de objetos de salones.
 */
export const getAllSalones = async ({ limit, offset, order = 'titulo', asc = true }) => {
    // Lógica de negocio/validación para construir la consulta (aquí se valida el orden)
    const validOrderColumns = ['titulo', 'capacidad', 'importe'];
    const orderByColumn = validOrderColumns.includes(order) ? order : 'titulo';
    const sortDirection = asc ? 'ASC' : 'DESC';

    const sql = `
        SELECT salon_id, titulo, direccion, latitud, longitud, capacidad, importe
        FROM salones
        WHERE activo = 1
        ORDER BY ${orderByColumn} ${sortDirection}
        LIMIT ? OFFSET ?
    `;
    const params = [limit, offset];

    try {
        // Llama al repositorio con la consulta y los parámetros
        return await salonRepo.findAll(sql, params);
    } catch (error) {
        console.error('Error al obtener salones con paginación:', error);
        throw error;
    }
};

/**
 * Obtiene un salón activo por su ID (Read).
 * @param {number} salonId - El ID del salón a buscar.
 * @returns {Promise<object | null>} El objeto salón o null si no se encuentra.
 */
export const getSalonById = async (salonId) => {
    try {
        const salon = await salonRepo.findById(salonId);
        return salon || null;
    } catch (error) {
        console.error(`Error al obtener salón con ID ${salonId}:`, error);
        throw error;
    }
};

/**
 * Crea un nuevo salón en la base de datos (Add).
 * @param {object} salonData - Objeto con los datos del nuevo salón.
 * @returns {Promise<number>} El ID del salón recién creado.
 */
export const createSalon = async (salonData) => {
    try {
        // Lógica de negocio: solo llamar al repositorio con los datos
        return await salonRepo.insert(salonData);
    } catch (error) {
        console.error('Error al crear salón:', error);
        throw error;
    }
};

/**
 * Actualiza un salón por su ID (Edit).
 * @param {number} salonId - El ID del salón a actualizar.
 * @param {object} salonData - Objeto con los campos a modificar.
 * @returns {Promise<number>} El número de filas afectadas (0 o 1).
 */
export const updateSalon = async (salonId, salonData) => {
    // Lógica de negocio/preparación: construir la consulta de actualización dinámica
    const updatableColumns = ['titulo', 'direccion', 'latitud', 'longitud', 'capacidad', 'importe', 'activo'];

    const updates = {};
    for (const key of updatableColumns) {
        // Verifica que la propiedad exista en los datos de entrada
        if (Object.prototype.hasOwnProperty.call(salonData, key)) {
            updates[key] = salonData[key];
        }
    }

    const keys = Object.keys(updates);
    if (keys.length === 0) {
        return 0; // No hay nada que actualizar
    }

    const setClauses = keys.map(key => `${key} = ?`).join(', ');
    const sql = `
        UPDATE salones
        SET ${setClauses}
        WHERE salon_id = ?
    `;

    const params = [...Object.values(updates), salonId];

    try {
        // Llama al repositorio con la consulta dinámica y los parámetros
        return await salonRepo.update(sql, params);
    } catch (error) {
        console.error(`Error al actualizar salón con ID ${salonId}:`, error);
        throw error;
    }
};

/**
 * Realiza un soft delete (desactivación) de un salón por su ID.
 * @param {number} salonId - El ID del salón a desactivar.
 * @returns {Promise<number>} El número de filas afectadas (0 o 1).
 */
export const deleteSalon = async (salonId) => {
    try {
        // Lógica de negocio: solo llamar al repositorio
        return await salonRepo.deactivate(salonId);
    } catch (error) {
        console.error(`Error al desactivar salón con ID ${salonId}:`, error);
        throw error;
    }
};