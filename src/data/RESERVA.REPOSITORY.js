import { getDbPool } from '../config/db.js'; // Asume que db.js está en src/config/db.js

// --- CONSULTAS READ ---

export const findAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM reservas WHERE activo = 1');
  return rows;
};

export const findById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM reservas WHERE reserva_id = ? AND activo = 1', [id]);
  return rows[0];
};

export const findByUsuario = async (usuario_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM reservas WHERE usuario_id = ? AND activo = 1',
    [usuario_id]
  );
  return rows;
};

export const findEstadisticasReservas = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('CALL reservas_por_mes()');
  return rows[0];
};

export const findReservasParaCSV = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query(`
    SELECT
      r.reserva_id,
      CONCAT(u.nombre, ' ', u.apellido) AS cliente,
      s.titulo AS salon,
      t.hora_desde AS turno,
      r.fecha_reserva,
      r.tematica,
      r.importe_total
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    JOIN salones s ON r.salon_id = s.salon_id
    JOIN turnos t ON r.turno_id = t.turno_id
    WHERE r.activo = 1
  `);
  return rows;
};

// --- CONSULTAS WRITE (Usadas dentro de Transacciones o por separado) ---

export const insertReserva = async (conn, { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon }) => {
    const [result] = await conn.query(
        `INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, 0]
    );
    return result.insertId;
};

export const insertReservaServicio = async (conn, reserva_id, servicio) => {
    await conn.query(
        `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe)
         VALUES (?, ?, ?)`,
        [reserva_id, servicio.servicio_id, servicio.importe]
    );
};

export const updateReservaTotal = async (conn, reserva_id, importe_total) => {
    await conn.query(
        `UPDATE reservas SET importe_total = ? WHERE reserva_id = ?`,
        [importe_total, reserva_id]
    );
};

export const updateReserva = async (id, data) => {
  const pool = getDbPool();
  await pool.query('UPDATE reservas SET ? WHERE reserva_id = ?', [data, id]);
};

export const deactivateReserva = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE reservas SET activo = 0 WHERE reserva_id = ?', [id]);
};