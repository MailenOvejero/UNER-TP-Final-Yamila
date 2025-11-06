import { getDbPool } from '../config/db.js';

// --- FUNCIONES READ (Repository) ---

export const findByUsername = async (username) => {
  const pool = getDbPool();
  const sql = 'SELECT usuario_id, nombre_usuario, contrasenia, tipo_usuario, activo FROM usuarios WHERE nombre_usuario = ? AND activo = 1';
  const [rows] = await pool.query(sql, [username]);
  return rows.length ? rows[0] : null;
};

export const findAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE activo = 1');
  return rows;
};

export const findById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ? AND activo = 1', [id]);
  return rows[0];
};

export const findAdminEmails = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT nombre_usuario FROM usuarios WHERE tipo_usuario = 1 AND activo = 1'
  );
  return rows;
};

// --- FUNCIONES WRITE (Repository) ---

export const insert = async (data) => {
  const pool = getDbPool();
  // Nota: La contraseña ya viene hasheada desde el Service
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.nombre, data.apellido, data.nombre_usuario, data.contrasenia, data.tipo_usuario, data.celular, data.foto]
  );
  return result.insertId;
};

export const update = async (id, data) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [data, id]);
};

export const deactivate = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id]);
};