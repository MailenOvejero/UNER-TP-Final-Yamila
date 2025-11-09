import {
  getAllServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio
} from '../data/servicio.data.js';

// listar servicios activos
export const listarServicios = async () => {
  return await getAllServicios();
};

// servicio por ID
export const obtenerServicio = async (id) => {
  return await getServicioById(id);
};

// crear servicio
export const crearServicio = async (datos) => {
  return await createServicio(datos);
};

// actualizar servicio existente
export const actualizarServicio = async (id, datos) => {
  return await updateServicio(id, datos);
};

// (soft delete)
export const eliminarServicio = async (id) => {
  return await deleteServicio(id);
};
