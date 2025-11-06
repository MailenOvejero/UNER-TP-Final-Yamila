import { getDbPool } from '../config/db.js';
import crypto from 'crypto';
// Importación ajustada para encontrar el repositorio en src/data
import * as usuarioRepo from '../data/USUARIO.REPOSITORY.js';

// Función para generar el hash MD5 de una contraseña (según configuración actual de la base)
const hashPassword = (text) => crypto.createHash('md5').update(text).digest('hex');

// Consulta un usuario por su nombre de usuario (email), usado en login
export const getUserByUsername = async (username) => {
  try {
    // Llama al repositorio
    return await usuarioRepo.findByUsername(username);
  } catch (error) {
    console.error("Error al obtener usuario por nombre de usuario:", error);
    // Manejo de error de la capa de servicio
    throw new Error('Database query failed');
  }
};

// Compara la contraseña ingresada con la almacenada (ambas en formato MD5)
// Esta es lógica de negocio y se mantiene en el servicio.
export const verifyPassword = (plainPassword, hashedPassword) => {
  const incomingHash = hashPassword(plainPassword);
  return incomingHash === hashedPassword;
};

// Devuelve todos los usuarios activos registrados en el sistema
export const getAll = async () => {
  // Llama al repositorio
  return usuarioRepo.findAll();
};

// Busca un usuario específico por su ID (solo si está activo)
export const getById = async (id) => {
  // Llama al repositorio
  return usuarioRepo.findById(id);
};

// Inserta un nuevo usuario en la base, aplicando hash a la contraseña
export const create = async (data) => {
  // Lógica de negocio: hashear la contraseña antes de guardar
  const hash = hashPassword(data.contrasenia);
  const dataWithHash = { ...data, contrasenia: hash };

  // Llama al repositorio
  const insertId = await usuarioRepo.insert(dataWithHash);
  return { usuario_id: insertId };
};

// Actualiza los datos de un usuario existente por su ID
export const update = async (id, data) => {
  // Llama al repositorio
  await usuarioRepo.update(id, data);
  return { message: 'Usuario actualizado' };
};

// Marca un usuario como inactivo (eliminación lógica)
export const softDelete = async (id) => {
  // Llama al repositorio
  await usuarioRepo.deactivate(id);
};

// Devuelve los correos electrónicos de todos los administradores activos
export const obtenerEmailsAdministradores = async () => {
  try {
    // Llama al repositorio
    const rows = await usuarioRepo.findAdminEmails();
    // Lógica de negocio: mapear los resultados a un array de emails
    return rows.map(row => row.nombre_usuario);
  } catch (error) {
    console.error('Error al obtener emails de administradores:', error.message);
    return [];
  }
};
