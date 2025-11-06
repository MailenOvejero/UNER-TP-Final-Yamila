// swc/data/servicio.data.js
import { getDbPool } from '../config/db.js';


// Obtener todos los servicios activos
export const getAllServicios = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM servicios WHERE activo = 1');
  return rows;
};

// Obtener un servicio por ID
export const getServicioById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM servicios WHERE servicio_id = ? AND activo = 1',
    [id]
  );
  return rows[0];
};

// Crear un nuevo servicio
export const createServicio = async ({ descripcion, importe }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'INSERT INTO servicios (descripcion, importe) VALUES (?, ?)',
    [descripcion, importe]
  );
  return result.insertId;
};

// Actualizar un servicio existente
export const updateServicio = async (id, { descripcion, importe, activo }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE servicios SET descripcion = ?, importe = ?, activo = ? WHERE servicio_id = ?',
    [descripcion, importe, activo, id]
  );
  return result.affectedRows;
};

// Soft delete de un servicio
export const deleteServicio = async (id) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE servicios SET activo = 0 WHERE servicio_id = ?',
    [id]
  );
  return result.affectedRows;
};
