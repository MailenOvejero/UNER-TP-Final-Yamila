import { getDbPool } from '../config/db.js'; // CAMBIO DE SINTAXIS
import crypto from 'crypto'; // Modulo de Node: Importar el módulo Crypto

/**
 * @param {string} passwordText La contraseña en texto plano.
 * @returns {string} El hash MD5 de 32 caracteres.
 */
const hashPassword = (passwordText) => {
    // Usamos MD5 +hex, xq es como esta configurada la base de datos existente
    const generatedHash = crypto.createHash('md5').update(passwordText).digest('hex');
    console.log(`[DEBUG HASH] Contraseña: "${passwordText}" -> Hash: ${generatedHash}`); // LÍNEA DE DEBUG
    return generatedHash;
};

/**
 * Busca un usuario por su nombre de usuario (email) para el proceso de autenticación.
 * @param {string} username El nombre de usuario.
 * @returns {Promise<object|null>} El objeto usuario si existe, o null.
 */
export const getUserByUsername = async (username) => {
    const sql = 'SELECT usuario_id, nombre_usuario, contrasenia, tipo_usuario, activo FROM usuarios WHERE nombre_usuario = ? AND activo = 1';
    
    try {
        const pool = getDbPool(); // OBTENER EL POOL
        const [rows] = await pool.query(sql, [username]);
        return rows.length ? rows[0] : null; 
    } catch (error) { 
        console.error("Error al obtener usuario por nombre de usuario:", error);
        throw new Error('Database query failed');
    }
}

/**
 * Verifica si la contraseña proporcionada coincide con la contraseña hasheada del usuario.
 * @param {string} plainPassword Contraseña ingresada por el usuario.
 * @param {string} hashedPassword Contraseña hasheada almacenada en la DB.
 * @returns {boolean} True si coinciden.
 */
export const verifyPassword = (plainPassword, hashedPassword) => {
    // Hasheamos la contraseña de entrada y la comparamos con el hash de la DB
    const incomingHash = hashPassword(plainPassword);
    return incomingHash === hashedPassword;
}