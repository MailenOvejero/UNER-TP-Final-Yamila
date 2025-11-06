// swc/service/servicio.service.js
import {
  getAllServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
} from '../data/servicio.data.js';

// Listar todos los servicios activos
export const listarServicios = async () => {
  return await getAllServicios();
};

// Obtener un servicio por ID
export const obtenerServicio = async (id) => {
  return await getServicioById(id);
};

// Crear un nuevo servicio
export const crearServicio = async (datos) => {
  return await createServicio(datos);
};

// Actualizar un servicio existente
export const actualizarServicio = async (id, datos) => {
  return await updateServicio(id, datos);
};

// Eliminar lógicamente un servicio
export const eliminarServicio = async (id) => {
  return await deleteServicio(id);
};
