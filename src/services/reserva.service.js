import {
  getAllReservas,
  getReservaById,
  getReservasByUsuario,
  createReserva, // F(Capa de datos)
  updateReserva,
  softDeleteReserva,
  getEstadisticasPorMes,
  getReservasCSV,
  verificarDisponibilidadReserva,

  // Estas son las f(para comentarios y encuestas)
  createComentario,
  getComentariosByReserva,
  createEncuesta,
  getEncuestasByReserva,
  getEncuestaByReservaAndUser
} from '../data/reserva.data.js';

import { getReservaById as dataGetReservaById } from '../data/reserva.data.js'; // si ya existe, úsalo

// También podríamos necesitar importar el helper de email si no estuviera en el controlador
// xej, import { enviarNotificacionReserva, enviarNotificacionAdmin } from '../utils/email.helper.js'; 


// ------- Listar todas las reservas activas ------

export const listarReservas = async () => {
  return await getAllReservas();
};

// ------- reserva por ID -------

export const obtenerReserva = async (id) => {
  return await getReservaById(id);
};

// ---- reservas de un usuario específico ---
export const obtenerReservasDelUsuario = async (usuario_id) => {
  return await getReservasByUsuario(usuario_id);
};

/**
 * Crea una nueva reserva después de verificar la disponibilidad
 * @param {Object} datos - Datos de la reserva
 * @param {string} datos.fecha_reserva - Fecha de la reserva (YYYY-MM-DD)
 * @param {number} datos.salon_id - ID del salón
 * @param {number} datos.turno_id - ID del turno
 * @param {number} datos.usuario_id - ID del usuario
 * @param {number} datos.importe_salon - Importe del salón
 * @param {Array} datos.servicios - Array de servicios adicionales
 * @param {string} datos.ruta_comprobante - Ruta del comprobante de pago
 * @returns {Promise<Object>} - Objeto con la información de la reserva creada
 * @throws {CustomError} - Si el salón no está disponible para la fecha y turno solicitados
 */
export const crearReserva = async (datos) => {
  const { fecha_reserva, salon_id, turno_id } = datos;

  // Verifico disponibilidad
  const { disponible, reservasExistentes } = await verificarDisponibilidadReserva(
    fecha_reserva,
    salon_id,
    turno_id
  );

  if (!disponible) {
    throw new CustomError(
      'El salón no está disponible para la fecha y turno seleccionados. Por favor, elija otra fecha u horario.',
      400
    );
  }

  // Creo reserva
  const nuevaReserva = await createReserva(datos);
  
  // OJoN, la lógica de envío de correos y notificaciones se dejó en el controlador 
  // (`RESERVA.CONTROLLER.js`) porque requiere acceder al "pool" de la BD para 
  // obtener datos completos y correos de administradores
  
  return nuevaReserva;
};

// Actualizo reserva
export const actualizarReserva = async (id, datos) => {
  await updateReserva(id, datos);
  return { message: 'Reserva actualizada' };
};

//   (softDelete)
export const eliminarReserva = async (id) => {
  await softDeleteReserva(id);
  return { message: 'Reserva desactivada' };
};

// get estadísticas mensuales (procedimiento almacenado)
export const obtenerEstadisticas = async () => {
  return await getEstadisticasPorMes();
};


// get reservas para exportar a CSV
export const obtenerReservasParaCSV = async () => {
  return await getReservasCSV();
};


// ------- extra COMENTARIOS -------
export const agregarComentario = async ({ reserva_id, usuario_id, comentario }) => {
  // validar existencia de reserva
  const reserva = await dataGetReservaById(reserva_id);
  if (!reserva) throw new Error('Reserva no encontrada');

  const result = await createComentario({ reserva_id, usuario_id, comentario });
  return result;
};

export const listarComentarios = async (reserva_id) => {
  // validar existencia de reserva
  const reserva = await dataGetReservaById(reserva_id);
  if (!reserva) throw new Error('Reserva no encontrada');

  return await getComentariosByReserva(reserva_id);
};


// ------- extra ENCUESTAS -------
export const agregarEncuesta = async ({ reserva_id, usuario_id, puntuacion, comentarios }) => {
  // validar reserva existe
  const reserva = await dataGetReservaById(reserva_id);
  if (!reserva) throw new Error('Reserva no encontrada');

  // validar que la encuesta la envía el dueño de la reserva
  if (reserva.usuario_id !== Number(usuario_id)) throw new Error('No estás autorizado para encuestar esta reserva');

  // validar que la fecha de la reserva ya pasó (fecha_reserva < hoy)
  const hoy = new Date();
  const fechaReserva = new Date(reserva.fecha_reserva);
  // compara solo la fecha (ignora horas)
  const fechaHoyStr = hoy.toISOString().slice(0,10);
  const fechaReservaStr = fechaReserva.toISOString().slice(0,10);
  if (fechaReservaStr >= fechaHoyStr) throw new Error('La encuesta solo puede completarse después de realizada la reserva');

  //  prevenir duplicados: 1 encuesta por usuario por reserva
  const ya = await getEncuestaByReservaAndUser(reserva_id, usuario_id);
  if (ya) throw new Error('Ya completaste la encuesta para esta reserva');

  // validar puntuacion (entre 1 y 5
  const p = Number(puntuacion);
  if (!Number.isInteger(p) || p < 1 || p > 5) throw new Error('Puntuación inválida (1-5)');

  return await createEncuesta({ reserva_id, usuario_id, puntuacion: p, comentarios });
};

export const listarEncuestas = async (reserva_id) => {
  // validar existencia de reserva
  const reserva = await dataGetReservaById(reserva_id);
  if (!reserva) throw new Error('Reserva no encontrada');
  return await getEncuestasByReserva(reserva_id);
};


import { getDbPool } from '../config/db.js';

export const agregarInvitado = async ({ reserva_id, nombre, apellido, edad, email }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    `INSERT INTO invitados (reserva_id, nombre, apellido, edad, email) VALUES (?, ?, ?, ?, ?)`,
    [reserva_id, nombre, apellido, edad || null, email || null]
  );
  return { invitado_id: result.insertId, reserva_id, nombre, apellido, edad, email };
};

export const listarInvitados = async (reserva_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    `SELECT * FROM invitados WHERE reserva_id = ? AND activo = 1`,
    [reserva_id]
  );
  return rows;
};

export const actualizarInvitado = async (invitado_id, data) => {
  const pool = getDbPool();
  const { nombre, apellido, edad, email } = data;
  await pool.query(
    `UPDATE invitados SET nombre=?, apellido=?, edad=?, email=?, modificado=NOW() WHERE invitado_id=?`,
    [nombre, apellido, edad || null, email || null, invitado_id]
  );
  return { invitado_id, ...data };
};

export const eliminarInvitado = async (invitado_id) => {
  const pool = getDbPool();
  await pool.query(
    `UPDATE invitados SET activo=0, modificado=NOW() WHERE invitado_id=?`,
    [invitado_id]
  );
  return { invitado_id, message: 'Invitado eliminado (soft delete)' };
};
