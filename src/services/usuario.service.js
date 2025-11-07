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

import { sendEmailWithTemplate } from './email.service.js';

// Autenticación: buscar usuario por email
export const findUserByUsername = async (username) => {
  return await getUserByUsername(username);
};

// Verificación de contraseña (pasamos el ID para migrar)
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

// Crear nuevo usuario con envío de correos
export const createUser = async (data) => {
  const { usuario_id } = await createUserData(data);

  const emailUsuario = data.nombre_usuario || data.email;
  const nombreUsuario = data.nombre || 'Usuario';

  // Enviar correo de bienvenida al usuario
  if (emailUsuario) {
    try {
      await sendEmailWithTemplate(
        emailUsuario,
        '¡Bienvenido/a a Nuestra Plataforma!',
        'bienvenida',
        { nombre: nombreUsuario }
      );
    } catch (error) {
      console.error('[EMAIL] Error al enviar correo de bienvenida:', error.message);
      // No relanzamos el error para no detener el flujo de creación de usuario
    }
  } else {
    console.warn('[EMAIL] Usuario sin email definido, no se envió bienvenida.');
  }

  // Notificar a los administradores
  try {
    const adminEmails = await getAdminEmailsData();
    for (const adminEmail of adminEmails) {
      await sendEmailWithTemplate(
        adminEmail,
        'Nuevo usuario registrado',
        'notificacionAdmin',
        {
          nombre: nombreUsuario,
          email: emailUsuario
        }
      );
    }
  } catch (error) {
    console.error('[EMAIL] Error al notificar a administradores:', error.message);
    // No relanzamos el error para no detener el flujo de creación de usuario
  }

  return {
    usuario_id,
    nombre: nombreUsuario,
    nombre_usuario: emailUsuario
  };
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
