// src/services/RESERVA.SERVICE.js

import {
  getAllReservas,
  getReservaById,
  getReservasByUsuario,
  createReserva, // Función de la capa de datos
  updateReserva,
  softDeleteReserva,
  getEstadisticasPorMes,
  getReservasCSV,

  // Nuevas funciones para comentarios y encuestas
  createComentario,
  getComentariosByReserva,
  createEncuesta,
  getEncuestasByReserva,
  getEncuestaByReservaAndUser
} from '../data/reserva.data.js';

import { getReservaById as dataGetReservaById } from '../data/reserva.data.js'; // si ya existe, úsalo

// También podrías necesitar importar aquí el helper de email si no lo tienes ya en el controlador
// import { enviarNotificacionReserva, enviarNotificacionAdmin } from '../utils/email.helper.js'; 


// ----------------------------------------------------------------------
// Listar todas las reservas activas
// ----------------------------------------------------------------------
export const listarReservas = async () => {
  return await getAllReservas();
};

// ----------------------------------------------------------------------
// Obtener una reserva por ID
// ----------------------------------------------------------------------
export const obtenerReserva = async (id) => {
  return await getReservaById(id);
};

// ----------------------------------------------------------------------
// Obtener reservas de un usuario específico
// ----------------------------------------------------------------------
export const obtenerReservasDelUsuario = async (usuario_id) => {
  return await getReservasByUsuario(usuario_id);
};

// ----------------------------------------------------------------------
// FUNCIÓN MODIFICADA: Ahora acepta 'datos', que incluye 'ruta_comprobante'
// ----------------------------------------------------------------------
// Crear una nueva reserva con servicios y comprobante
export const crearReserva = async (datos) => {
  // 1. Lógica de Negocio (Aquí iría la verificación de disponibilidad, por ejemplo)
  // ...

  // 2. Persistencia de datos
  // 'datos' ya contiene: { fecha_reserva, salon_id, ..., ruta_comprobante }
  const nuevaReserva = await createReserva(datos); 
  
  // NOTA: La lógica de envío de correos y notificaciones se dejó en el controlador 
  // (`RESERVA.CONTROLLER.js`) porque requiere acceder al `pool` de la BD para 
  // obtener datos completos y correos de administradores. Si esa lógica solo 
  // usara los datos iniciales, podría moverse aquí.
  
  return nuevaReserva;
};
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// Actualizar una reserva existente
// ----------------------------------------------------------------------
export const actualizarReserva = async (id, datos) => {
  await updateReserva(id, datos);
  return { message: 'Reserva actualizada' };
};

// ----------------------------------------------------------------------
// Eliminar lógicamente una reserva
// ----------------------------------------------------------------------
export const eliminarReserva = async (id) => {
  await softDeleteReserva(id);
  return { message: 'Reserva desactivada' };
};

// ----------------------------------------------------------------------
// Obtener estadísticas mensuales (procedimiento almacenado)
// ----------------------------------------------------------------------
export const obtenerEstadisticas = async () => {
  return await getEstadisticasPorMes();
};

// ----------------------------------------------------------------------
// Obtener reservas para exportar a CSV
// ----------------------------------------------------------------------
export const obtenerReservasParaCSV = async () => {
  return await getReservasCSV();
};

// ----------------------------------------------------------------------
// ----------------- COMENTARIOS -----------------
// ----------------------------------------------------------------------
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

// ----------------------------------------------------------------------
// ----------------- ENCUESTAS -----------------
// ----------------------------------------------------------------------
export const agregarEncuesta = async ({ reserva_id, usuario_id, puntuacion, comentarios }) => {
  // 1) validar reserva existe
  const reserva = await dataGetReservaById(reserva_id);
  if (!reserva) throw new Error('Reserva no encontrada');

  // 2) validar que la encuesta la envía el dueño de la reserva
  if (reserva.usuario_id !== Number(usuario_id)) throw new Error('No estás autorizado para encuestar esta reserva');

  // 3) validar que la fecha de la reserva ya pasó (fecha_reserva < hoy)
  const hoy = new Date();
  const fechaReserva = new Date(reserva.fecha_reserva);
  // compara solo la fecha (ignora horas)
  const fechaHoyStr = hoy.toISOString().slice(0,10);
  const fechaReservaStr = fechaReserva.toISOString().slice(0,10);
  if (fechaReservaStr >= fechaHoyStr) throw new Error('La encuesta solo puede completarse después de realizada la reserva');

  // 4) prevenir duplicados: 1 encuesta por usuario por reserva
  const ya = await getEncuestaByReservaAndUser(reserva_id, usuario_id);
  if (ya) throw new Error('Ya completaste la encuesta para esta reserva');

  // 5) validar puntuacion entre 1 y 5
  const p = Number(puntuacion);
  if (!Number.isInteger(p) || p < 1 || p > 5) throw new Error('Puntuación inválida (1-5)');

  return await createEncuesta({ reserva_id, usuario_id, puntuacion: p, comentarios });
};

export const listarEncuestas = async (reserva_id) => {
  // Opcional: validar existencia de reserva
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
