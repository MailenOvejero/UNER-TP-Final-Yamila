// swc/data/turno.data.js

import { getDbPool } from '../config/db.js';

// Obtener todos los turnos activos ordenados por 'orden'
export const getAllTurnos = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM turnos WHERE activo = 1 ORDER BY orden ASC');
  return rows;
};

// Obtener un turno por ID
export const getTurnoById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM turnos WHERE turno_id = ? AND activo = 1',
    [id]
  );
  return rows[0] || null;
};

// Crear un nuevo turno
export const createTurno = async ({ orden, hora_desde, hora_hasta }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)',
    [orden, hora_desde, hora_hasta]
  );
  return result.insertId;
};

// Actualizar un turno existente
export const updateTurno = async (id, { orden, hora_desde, hora_hasta, activo }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE turnos SET orden = ?, hora_desde = ?, hora_hasta = ?, activo = ? WHERE turno_id = ?',
    [orden, hora_desde, hora_hasta, activo ?? 1, id]
  );
  return result.affectedRows;
};

// Soft delete de turno
export const deleteTurno = async (id) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    'UPDATE turnos SET activo = 0 WHERE turno_id = ?',
    [id]
  );
  return result.affectedRows;
};
