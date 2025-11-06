// swc/service/usuario.service.js
import {
  getUserByUsername,
  verifyPassword,
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  softDeleteUsuario,
  obtenerEmailsAdministradores
} from '../data/usuario.data.js';

// Autenticación: buscar usuario por email
export const buscarUsuarioPorEmail = async (username) => {
  return await getUserByUsername(username);
};


// Verificación de contraseña (pasamosel ID para migrar)
export const validarPassword = async (plain, hashed, userId) => {
  return await verifyPassword(plain, hashed, userId);
};


// Listar todos los usuarios activos
export const listarUsuarios = async () => {
  return await getAllUsuarios();
};

// Obtener usuario por ID
export const obtenerUsuario = async (id) => {
  return await getUsuarioById(id);
};

// Crear nuevo usuario
export const crearUsuario = async (datos) => {
  return await createUsuario(datos);
};

// Actualizar usuario
export const actualizarUsuario = async (id, datos) => {
  return await updateUsuario(id, datos);
};

// Eliminar usuario (soft delete)
export const eliminarUsuario = async (id) => {
  return await softDeleteUsuario(id);
};

// Obtener emails de administradores activos
export const obtenerEmailsAdmins = async () => {
  return await obtenerEmailsAdministradores();
};
