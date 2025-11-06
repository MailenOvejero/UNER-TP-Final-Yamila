import { getDbPool } from '../config/db.js';

// --- FUNCIONES READ (Repository) ---

export const findAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM servicios WHERE activo = 1');
  return rows;
};

export const findById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM servicios WHERE servicio_id = ? AND activo = 1', [id]);
  return rows[0];
};

// --- FUNCIONES WRITE (Repository) ---

export const insert = async ({ descripcion, importe }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'INSERT INTO servicios (descripcion, importe) VALUES (?, ?)',
    [descripcion, importe]
  );
  return result.insertId;
};

export const update = async (id, { descripcion, importe, activo }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE servicios SET descripcion = ?, importe = ?, activo = ? WHERE servicio_id = ?',
    [descripcion, importe, activo, id]
  );
  return result.affectedRows;
};

export const deactivate = async (id) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE servicios SET activo = 0 WHERE servicio_id = ?',
    [id]
  );
  return result.affectedRows;
};