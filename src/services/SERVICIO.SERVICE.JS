import { getDbPool } from '../config/db.js';
// Importación ajustada para encontrar el repositorio en src/data
import * as servicioRepo from '../data/SERVICIO.REPOSITORY.JS';

export const getAllServicios = async () => {
  // Llama al repositorio
  return servicioRepo.findAll();
};

export const getServicioById = async (id) => {
  // Llama al repositorio
  return servicioRepo.findById(id);
};

export const createServicio = async (data) => {
  // Llama al repositorio
  return servicioRepo.insert(data);
};

export const updateServicio = async (id, data) => {
  // Llama al repositorio
  return servicioRepo.update(id, data);
};

export const deleteServicio = async (id) => {
  // Llama al repositorio (función deactivate)
  return servicioRepo.deactivate(id);
};