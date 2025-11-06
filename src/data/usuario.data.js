// swc/data/usuario.data.js
import { getDbPool } from '../config/db.js';
import crypto from 'crypto';

// Hashea la contraseña en MD5 (según configuración actual de la base)
const hashPassword = (text) => crypto.createHash('md5').update(text).digest('hex');

// Buscar usuario por nombre de usuario (email)
export const getUserByUsername = async (username) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT usuario_id, nombre_usuario, contrasenia, tipo_usuario, activo FROM usuarios WHERE nombre_usuario = ? AND activo = 1',
    [username]
  );
  return rows.length ? rows[0] : null;
};

// Verificar contraseña (comparación de hashes MD5)
export const verifyPassword = (plainPassword, hashedPassword) => {
  const incomingHash = hashPassword(plainPassword);
  return incomingHash === hashedPassword;
};

// Obtener todos los usuarios activos
export const getAllUsuarios = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE activo = 1');
  return rows;
};

// Obtener usuario por ID
export const getUsuarioById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE usuario_id = ? AND activo = 1',
    [id]
  );
  return rows[0];
};

// Crear nuevo usuario (con hash MD5)
export const createUsuario = async (data) => {
  const pool = getDbPool();
  const hash = hashPassword(data.contrasenia);
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.nombre, data.apellido, data.nombre_usuario, hash, data.tipo_usuario, data.celular, data.foto]
  );
  return { usuario_id: result.insertId };
};

// Actualizar usuario por ID
export const updateUsuario = async (id, data) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [data, id]);
  return { message: 'Usuario actualizado' };
};

// Soft delete de usuario
export const softDeleteUsuario = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id]);
};

// Obtener emails de administradores activos
export const obtenerEmailsAdministradores = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT nombre_usuario FROM usuarios WHERE tipo_usuario = 1 AND activo = 1'
  );
  return rows.map(row => row.nombre_usuario);
};
