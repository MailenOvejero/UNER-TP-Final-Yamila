// swc/service/salon.service.js
import {
  getAllSalones,
  getSalonById,
  createSalon,
  updateSalon,
  deleteSalon
} from '../data/salon.data.js';

// Listar salones con paginación
export const listarSalones = async (options) => {
  return await getAllSalones(options);
};

// Obtener salón por ID
export const obtenerSalon = async (id) => {
  return await getSalonById(id);
};

// Crear nuevo salón
export const crearSalon = async (datos) => {
  return await createSalon(datos);
};

// Actualizar salón
export const actualizarSalon = async (id, datos) => {
  return await updateSalon(id, datos);
};

// Eliminar salón (soft delete)
export const eliminarSalon = async (id) => {
  return await deleteSalon(id);
};
