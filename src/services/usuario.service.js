// swc/service/usuario.service.js
import {
  getUserByUsername,
  verifyPassword,
  getAllUsers,
  getUserById,
  createUser as createUserData,
  updateUser as updateUserData,
  softDeleteUser as softDeleteUserData,
  getAdminEmails as getAdminEmailsData
} from '../data/usuario.data.js';

// Autenticación: buscar usuario por email
export const findUserByUsername = async (username) => {
  return await getUserByUsername(username);
};


// Verificación de contraseña (pasamosel ID para migrar)
export const validatePassword = async (plain, hashed, userId) => {
  return await verifyPassword(plain, hashed, userId);
};


// Listar todos los usuarios activos
export const listUsers = async () => {
  return await getAllUsers();
};

// Obtener usuario por ID
export const findUserById = async (id) => {
  return await getUserById(id);
};

// Crear nuevo usuario
export const createUser = async (data) => {
  // Ahora llamamos a la función renombrada, evitando la recursión infinita
  return await createUserData(data);
};

// Actualizar usuario
export const updateUser = async (id, data) => {
  return await updateUserData(id, data);
};

// Eliminar usuario (soft delete)
export const deleteUser = async (id) => {
  return await softDeleteUserData(id);
};

// Obtener emails de administradores activos
export const getAdminEmails = async () => {
  return await getAdminEmailsData();
};
