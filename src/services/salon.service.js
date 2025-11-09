import {
  getAllSalones,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon
} from '../data/salon.data.js';

// listar salones + paginación
export const listarSalones = async (options) => {
  return await getAllSalones(options);
};

// salón por ID
export const obtenerSalon = async (id) => {
  return await getSalonById(id);
};

// crear salón
export const crearSalon = async (datos) => {
  return await createSalon(datos);
};

// actualizar salón
export const actualizarSalon = async (id, datos) => {
  return await updateSalon(id, datos);
};

// (soft delete)
export const eliminarSalon = async (id) => {
  return await deleteSalon(id);
};
