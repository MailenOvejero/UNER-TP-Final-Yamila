import { getDbPool } from '../config/db.js';

// --- FUNCIONES READ (Repository) ---

/**
 * Obtiene salones activos con opciones de paginación.
 */
export const findAll = async (sql, params) => {
    const pool = getDbPool();
    // La lógica de la construcción del SQL se deja en el servicio para evitar repetir lógica aquí,
    // o se pasa la sentencia SQL ya construida. Aquí optamos por pasar SQL y parámetros.
    try {
        const [rows] = await pool.query(sql, params);
        return rows;
    } catch (error) {
        // En un repositorio, solo registramos el error de DB o lo lanzamos
        throw error;
    }
};

/**
 * Obtiene un salón activo por su ID.
 */
export const findById = async (salonId) => {
    const pool = getDbPool();
    const sql = 'SELECT * FROM salones WHERE salon_id = ? AND activo = 1';
    const params = [salonId];

    const [rows] = await pool.query(sql, params);
    return rows[0];
};

// --- FUNCIONES WRITE (Repository) ---

/**
 * Inserta un nuevo salón.
 */
export const insert = async (salonData) => {
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

    const [result] = await pool.query(sql, params);
    return result.insertId;
};

/**
 * Actualiza los campos de un salón por su ID.
 * Nota: El servicio debe construir la consulta y los parámetros dinámicamente.
 */
export const update = async (sql, params) => {
    const pool = getDbPool();
    // Recibimos la sentencia SQL y parámetros ya construidos del servicio.
    const [result] = await pool.query(sql, params);
    return result.affectedRows;
};

/**
 * Realiza un soft delete (desactivación).
 */
export const deactivate = async (salonId) => {
    const pool = getDbPool();
    const sql = `
        UPDATE salones
        SET activo = 0
        WHERE salon_id = ? AND activo = 1
    `;
    const params = [salonId];

    const [result] = await pool.query(sql, params);
    return result.affectedRows;
};