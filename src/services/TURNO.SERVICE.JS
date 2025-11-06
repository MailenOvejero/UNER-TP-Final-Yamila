import { getDbPool } from '../config/db.js';
// Importación ajustada para encontrar el repositorio en src/data
import * as turnoRepo from '../data/TURNO.REPOSITORY.JS';

export const getAllTurnos = async () => {
  // Llama al repositorio
  return turnoRepo.findAll();
};

export const getTurnoById = async (id) => {
  // Llama al repositorio y maneja el caso de no encontrado
  const turno = await turnoRepo.findById(id);
  return turno || null;
};

export const createTurno = async (data) => {
  // Llama al repositorio
  return turnoRepo.insert(data);
};

export const updateTurno = async (id, data) => {
  // Llama al repositorio, pasando la data incluyendo el estado 'activo'
  return turnoRepo.update(id, data);
};

export const deleteTurno = async (id) => {
  // Llama al repositorio para el soft delete
  return turnoRepo.deactivate(id);
};