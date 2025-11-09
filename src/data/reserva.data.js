import { getDbPool } from '../config/db.js';
import { CustomError } from '../utils/errorHandler.js';

// get todas las reservas activas
export const getAllReservas = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM reservas WHERE activo = 1');
  return rows;
};

// get reserva por ID
export const getReservaById = async (id) => {
  const pool = getDbPool();
  const [rows] = await pool.query('SELECT * FROM reservas WHERE reserva_id = ? AND activo = 1', [id]);
  return rows[0];
};

// get reservas por usuario
export const getReservasByUsuario = async (usuario_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    'SELECT * FROM reservas WHERE usuario_id = ? AND activo = 1',
    [usuario_id]
  );
  return rows;
};

// crear reserva + servicios asociados
export const createReserva = async (data) => {
  const {
    fecha_reserva, salon_id, usuario_id, turno_id, importe_salon, servicios,
    ruta_comprobante, foto_cumpleaniero = null, tematica = null
  } = data;

  const pool = getDbPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, importe_salon, importe_total, ruta_comprobante, foto_cumpleaniero, tematica)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fecha_reserva, salon_id, usuario_id, turno_id, importe_salon, 0, ruta_comprobante, foto_cumpleaniero, tematica]
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

// cctualizar reserva
export const updateReserva = async (id, data) => {
  const pool = getDbPool();
  // esta función ya maneja 'ruta_comprobante' si se pasa en el data
  await pool.query('UPDATE reservas SET ? WHERE reserva_id = ?', [data, id]); 
  return { message: 'Reserva actualizada' };
};

// (soft delete)
export const softDeleteReserva = async (id) => {
  const pool = getDbPool();
  await pool.query('UPDATE reservas SET activo = 0 WHERE reserva_id = ?', [id]);
};

// get estadísticas por mes (usando "procedimiento almacenado")
export const getEstadisticasPorMes = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query('CALL reservas_por_mes()');
  return rows[0];
};

// Verificar disponibilidad de reserva (x fecha y turno)
export const verificarDisponibilidadReserva = async (fecha_reserva, salon_id, turno_id) => {
  const pool = getDbPool();
  
  // Verificar si ya existe una reserva activa para la misma fecha, salón y turno
  const [reservasExistentes] = await pool.query(
    `SELECT r.* FROM reservas r 
     WHERE r.fecha_reserva = ? 
     AND r.salon_id = ? 
     AND r.turno_id = ? 
     AND r.activo = 1`,
    [fecha_reserva, salon_id, turno_id]
  );

  return {
    disponible: reservasExistentes.length === 0,
    reservasExistentes
  };
};

// get reservas para exportar a CSV
export const getReservasCSV = async () => {
  const pool = getDbPool();
  const [rows] = await pool.query(`
    SELECT 
      r.reserva_id,
      CONCAT(u.nombre, ' ', u.apellido) AS cliente,
      s.titulo AS salon,
      t.hora_desde AS turno,
      r.fecha_reserva,
      r.importe_total
      -- Se elimina r.tematica de la consulta SELECT
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    JOIN salones s ON r.salon_id = s.salon_id
    JOIN turnos t ON r.turno_id = t.turno_id
    WHERE r.activo = 1
  `);
  return rows;
};

// ------- SITEMA DE COMENTARIOS -------
export const createComentario = async ({ reserva_id, usuario_id, comentario }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    `INSERT INTO comentarios (reserva_id, usuario_id, comentario) VALUES (?, ?, ?)`,
    [reserva_id, usuario_id, comentario]
  );
  return { comentario_id: result.insertId };
};

export const getComentariosByReserva = async (reserva_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    `SELECT c.comentario_id, c.reserva_id, c.usuario_id, c.comentario, c.creado,
            u.nombre, u.apellido, u.nombre_usuario AS email
     FROM comentarios c
     JOIN usuarios u ON c.usuario_id = u.usuario_id
     WHERE c.reserva_id = ?
     ORDER BY c.creado DESC`,
    [reserva_id]
  );
  return rows;
};

// ------- ENCUESTAS ---------
export const createEncuesta = async ({ reserva_id, usuario_id, puntuacion, comentarios }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    `INSERT INTO encuestas (reserva_id, usuario_id, puntuacion, comentarios) VALUES (?, ?, ?, ?)`,
    [reserva_id, usuario_id, puntuacion, comentarios || null]
  );
  return { encuesta_id: result.insertId };
};

export const getEncuestasByReserva = async (reserva_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    `SELECT e.encuesta_id, e.reserva_id, e.usuario_id, e.puntuacion, e.comentarios, e.creado,
            u.nombre, u.apellido
     FROM encuestas e
     JOIN usuarios u ON e.usuario_id = u.usuario_id
     WHERE e.reserva_id = ?
     ORDER BY e.creado DESC`,
    [reserva_id]
  );
  return rows;
};

export const getEncuestaByReservaAndUser = async (reserva_id, usuario_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    `SELECT * FROM encuestas WHERE reserva_id = ? AND usuario_id = ? LIMIT 1`,
    [reserva_id, usuario_id]
  );
  return rows[0];
};
