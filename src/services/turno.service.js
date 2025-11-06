// swc/service/turno.service.js
import {
  getAllTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
} from '../data/turno.data.js';

// Listar todos los turnos activos
export const listarTurnos = async () => {
  return await getAllTurnos();
};

// Obtener un turno por ID
export const obtenerTurno = async (id) => {
  return await getTurnoById(id);
};

// Crear un nuevo turno
export const crearTurno = async (datos) => {
  return await createTurno(datos);
};

// Actualizar un turno existente
export const actualizarTurno = async (id, datos) => {
  return await updateTurno(id, datos);
};

// Eliminar lógicamente un turno
export const eliminarTurno = async (id) => {
  return await deleteTurno(id);
};
