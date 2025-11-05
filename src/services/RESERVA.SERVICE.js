import { getDbPool } from '../config/db.js';

export const getAll = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM reservas WHERE activo = 1');
  return rows;
};

export const getById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM reservas WHERE reserva_id = ? AND activo = 1', [id]);
  return rows[0];
};

export const getByUsuario = async (usuario_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM reservas WHERE usuario_id = ? AND activo = 1',
    [usuario_id]
  );
  return rows;
};

export const create = async (data) => {
  const {
    fecha_reserva, salon_id, usuario_id, turno_id,
    foto_cumpleaniero, tematica, importe_salon, servicios
  } = data;

  const pool = getDbPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, 0]
    );

    const reserva_id = result.insertId;
    let totalServicios = 0;

    for (const servicio of servicios) {
      await conn.query(
        `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe)
         VALUES (?, ?, ?)`,
        [reserva_id, servicio.servicio_id, servicio.importe]
      );
      totalServicios += servicio.importe;
    }

    const importe_total = importe_salon + totalServicios;

    await conn.query(
      `UPDATE reservas SET importe_total = ? WHERE reserva_id = ?`,
      [importe_total, reserva_id]
    );

    await conn.commit();
    return { reserva_id, importe_total };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const update = async (id, data) => {
  const pool = getDbPool();
  await pool.query('UPDATE reservas SET ? WHERE reserva_id = ?', [data, id]);
  return { message: 'Reserva actualizada' };
};

export const softDelete = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE reservas SET activo = 0 WHERE reserva_id = ?', [id]);
};

export const getEstadisticasReservas = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('CALL reservas_por_mes()');
  return rows[0]; 
};

export const getReservasParaCSV = async () => {
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
