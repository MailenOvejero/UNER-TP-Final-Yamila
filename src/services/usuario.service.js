import { getDbPool } from '../config/db.js';
import crypto from 'crypto';

// Función para generar el hash MD5 de una contraseña (según configuración actual de la base)
const hashPassword = (text) => crypto.createHash('md5').update(text).digest('hex');

// Consulta un usuario por su nombre de usuario (email), usado en login
export const getUserByUsername = async (username) => {
  const sql = 'SELECT usuario_id, nombre_usuario, contrasenia, tipo_usuario, activo FROM usuarios WHERE nombre_usuario = ? AND activo = 1';
  try {
    const pool = getDbPool();
    const [rows] = await pool.query(sql, [username]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error("Error al obtener usuario por nombre de usuario:", error);
    throw new Error('Database query failed');
  }
};

// Compara la contraseña ingresada con la almacenada (ambas en formato MD5)
export const verifyPassword = (plainPassword, hashedPassword) => {
  const incomingHash = hashPassword(plainPassword);
  return incomingHash === hashedPassword;
};

// Devuelve todos los usuarios activos registrados en el sistema
export const getAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE activo = 1');
  return rows;
};

// Busca un usuario específico por su ID (solo si está activo)
export const getById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ? AND activo = 1', [id]);
  return rows[0];
};

// Inserta un nuevo usuario en la base, aplicando hash a la contraseña
export const create = async (data) => {
  const pool = getDbPool();
  const hash = hashPassword(data.contrasenia);
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.nombre, data.apellido, data.nombre_usuario, hash, data.tipo_usuario, data.celular, data.foto]
  );
  return { usuario_id: result.insertId };
};

// Actualiza los datos de un usuario existente por su ID
export const update = async (id, data) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [data, id]);
  return { message: 'Usuario actualizado' };
};

// Marca un usuario como inactivo (eliminación lógica)
export const softDelete = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id]);
};

// Devuelve los correos electrónicos de todos los administradores activos
export const obtenerEmailsAdministradores = async () => {
  const pool = getDbPool();
  try {
    const [rows] = await pool.query(
      'SELECT nombre_usuario FROM usuarios WHERE tipo_usuario = 1 AND activo = 1'
    );
    return rows.map(row => row.nombre_usuario);
  } catch (error) {
    console.error('Error al obtener emails de administradores:', error.message);
    return [];
  }
};
