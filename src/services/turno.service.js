import {
  getAllTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
} from '../data/turno.data.js';

// listar los turnos activos
export const listarTurnos = async () => {
  return await getAllTurnos();
};

// turno por ID
export const obtenerTurno = async (id) => {
  return await getTurnoById(id);
};

// crear turno
export const crearTurno = async (datos) => {
  return await createTurno(datos);
};

// actualizar turno
export const actualizarTurno = async (id, datos) => {
  return await updateTurno(id, datos);
};

// (soft delete)
export const eliminarTurno = async (id) => {
  return await deleteTurno(id);
};
