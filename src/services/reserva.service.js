
import {
  getAllReservas,
  getReservaById,
  getReservasByUsuario,
  createReserva, // Función de la capa de datos
  updateReserva,
  softDeleteReserva,
  getEstadisticasPorMes,
  getReservasCSV
} from '../data/reserva.data.js';

// También podrías necesitar importar aquí el helper de email si no lo tienes ya en el controlador
// import { enviarNotificacionReserva, enviarNotificacionAdmin } from '../utils/email.helper.js'; 


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