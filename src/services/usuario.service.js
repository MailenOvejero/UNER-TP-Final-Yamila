import { getDbPool } from '../config/db.js';
import crypto from 'crypto';

const hashPassword = (text) => crypto.createHash('md5').update(text).digest('hex');

export const getAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE activo = 1');
  return rows;
};

export const getById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ? AND activo = 1', [id]);
  return rows[0];
};

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

export const update = async (id, data) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [data, id]);
  return { message: 'Usuario actualizado' };
};

export const softDelete = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id]);
};
