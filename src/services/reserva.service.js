// swc/service/RESERVA.SERVICE.JS

import {
  getAllReservas,
  getReservaById,
  getReservasByUsuario,
  createReserva,
  updateReserva,
  softDeleteReserva,
  getEstadisticasPorMes,
  getReservasCSV
} from '../data/reserva.data.js';

// Listar todas las reservas activas
export const listarReservas = async () => {
  return await getAllReservas();
};

// Obtener una reserva por ID
export const obtenerReserva = async (id) => {
  return await getReservaById(id);
};

// Obtener reservas de un usuario específico
export const obtenerReservasDelUsuario = async (usuario_id) => {
  return await getReservasByUsuario(usuario_id);
};

// Crear una nueva reserva con servicios
export const crearReserva = async (datos) => {
  return await createReserva(datos);
};

// Actualizar una reserva existente
export const actualizarReserva = async (id, datos) => {
  await updateReserva(id, datos);
  return { message: 'Reserva actualizada' };
};

// Eliminar lógicamente una reserva
export const eliminarReserva = async (id) => {
  await softDeleteReserva(id);
  return { message: 'Reserva desactivada' };
};

// Obtener estadísticas mensuales (procedimiento almacenado)
export const obtenerEstadisticas = async () => {
  return await getEstadisticasPorMes();
};

// Obtener reservas para exportar a CSV
export const obtenerReservasParaCSV = async () => {
  return await getReservasCSV();
};
