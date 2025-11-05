import { getDbPool } from '../config/db.js';

/**
 * Obtiene todos los salones activos con opciones de paginación (Browse).
 * @param {object} options - Opciones de paginación (limit, offset, order, asc).
 * @returns {Promise<Array>} Lista de objetos de salones.
 */
export const getAllSalones = async ({ limit, offset, order = 'titulo', asc = true }) => {
    // Obtener el pool después de la inicialización, garantizando que DB_NAME esté cargado
    const pool = getDbPool();

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
        const [rows] = await pool.query(sql, params); 
        return rows; 
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
    const pool = getDbPool();
    const sql = 'SELECT * FROM salones WHERE salon_id = ? AND activo = 1'; 
    const params = [salonId];

    try {
        const [rows] = await pool.query(sql, params); 
        return rows[0] || null;
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
    const pool = getDbPool();
    const sql = `
        INSERT INTO salones 
        (titulo, direccion, latitud, longitud, capacidad, importe)
        VALUES (?, ?, ?, ?, ?, ?)
    `; 
    const params = [
        salonData.titulo,
        salonData.direccion,
        salonData.latitud || null,
        salonData.longitud || null, 
        salonData.capacidad || null, 
        salonData.importe
    ];

    try {
        const [result] = await pool.query(sql, params); 
        return result.insertId; 
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
    const pool = getDbPool();
    const updatableColumns = ['titulo', 'direccion', 'latitud', 'longitud', 'capacidad', 'importe', 'activo'];
    
    const updates = {};
    for (const key of updatableColumns) {
        if (salonData.hasOwnProperty(key)) {
            updates[key] = salonData[key];
        }
    }
    
    const keys = Object.keys(updates);
    if (keys.length === 0) {
        return 0;
    }

    const setClauses = keys.map(key => `${key} = ?`).join(', ');
    const sql = `
        UPDATE salones
        SET ${setClauses}
        WHERE salon_id = ?
    `;
    
    const params = [...Object.values(updates), salonId];
    
    try {
        const [result] = await pool.query(sql, params);
        return result.affectedRows; 
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
    const pool = getDbPool();
    const sql = `
        UPDATE salones
        SET activo = 0
        WHERE salon_id = ? AND activo = 1 
    `; 
    const params = [salonId];
    
    try {
        const [result] = await pool.query(sql, params);
        return result.affectedRows; 
    } catch (error) {
        console.error(`Error al desactivar salón con ID ${salonId}:`, error);
        throw error;
    }
};