import { getDbPool } from '../config/db.js';

// --- FUNCIONES READ (Repository) ---

export const findAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM turnos WHERE activo = 1 ORDER BY orden ASC');
  return rows;
};

export const findById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM turnos WHERE turno_id = ? AND activo = 1', [id]);
  return rows[0];
};

// --- FUNCIONES WRITE (Repository) ---

export const insert = async (data) => {
  const pool = getDbPool();
  const sql = 'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)';
  const [result] = await pool.query(sql, [data.orden, data.hora_desde, data.hora_hasta]);
  return result.insertId;
};

export const update = async (id, data) => {
  const pool = getDbPool();
  // El servicio debe asegurar que data.activo esté definido, si es necesario.
  const sql = 'UPDATE turnos SET orden = ?, hora_desde = ?, hora_hasta = ?, activo = ? WHERE turno_id = ?';
  const [result] = await pool.query(sql, [data.orden, data.hora_desde, data.hora_hasta, data.activo ?? 1, id]);
  return result.affectedRows;
};

export const deactivate = async (id) => {
  const pool = getDbPool();
  const sql = 'UPDATE turnos SET activo = 0 WHERE turno_id = ?';
  const [result] = await pool.query(sql, [id]);
  return result.affectedRows;
};