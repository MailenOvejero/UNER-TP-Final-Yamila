// src/data/usuario.data.js
import { getDbPool } from '../config/db.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto' // para detectar y validar contraseñas antiguas MD5

// ===============================================================
// Hashear contraseña con bcrypt (usado al crear o actualizar usuarios)
// ===============================================================
const hashPassword = async (plainText) => {
  const saltRounds = 10
  return await bcrypt.hash(plainText, saltRounds)
}

// ===============================================================
// Buscar usuario por nombre de usuario (email)
// ===============================================================
export const getUserByUsername = async (username) => {
  const pool = getDbPool()
  const [rows] = await pool.query(
    // ➡️ FIX DE LOGIN: Alias 'contrasenia' AS 'hashedPassword'
    'SELECT usuario_id, nombre, apellido, nombre_usuario, contrasenia AS hashedPassword, tipo_usuario, activo FROM usuarios WHERE nombre_usuario = ? AND activo = 1',
    [username]
  )
  return rows.length ? rows[0] : null
}

// ===============================================================
// Verificar contraseña y migrar automaticamente de MD5 a bcrypt
// ===============================================================
export const verifyPassword = async (plainPassword, hashedPassword, userId) => {
  const pool = getDbPool()
  const passwordLimpia = plainPassword.trim()
  let esValida = false

  // Caso 1: bcrypt actual
  if (hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$')) {
    esValida = await bcrypt.compare(passwordLimpia, hashedPassword)

  // Caso 2: hash MD5 antiguo
  } else if (hashedPassword.length === 32 && /^[a-f0-9]{32}$/i.test(hashedPassword)) {
    const md5 = crypto.createHash('md5').update(passwordLimpia).digest('hex')
    esValida = md5 === hashedPassword

    // Si coincide, migrar automaticamente a bcrypt
    if (esValida) {
      const nuevoHash = await bcrypt.hash(passwordLimpia, 10)
      await pool.query(
        `UPDATE usuarios SET contrasenia = ? WHERE usuario_id = ?`,
        [nuevoHash, userId]
      )
      console.log(`Usuario ${userId} migrado de MD5 a bcrypt`)
    }

  // Caso 3: formato desconocido
  } else {
    console.warn(`Hash con formato desconocido para usuario ${userId}`)
  }

  return esValida
}

// ===============================================================
// Obtener todos los usuarios activos
// ===============================================================
export const getAllUsuarios = async () => {
  const pool = getDbPool()
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE activo = 1')
  return rows
}

// ===============================================================
// Obtener usuario por ID
// ===============================================================
export const getUsuarioById = async (id) => {
  const pool = getDbPool()
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE usuario_id = ? AND activo = 1',
    [id]
  )
  return rows[0]
}

// ===============================================================
// Crear nuevo usuario (guarda siempre con bcrypt)
// ===============================================================
export const createUsuario = async (data) => {
  const pool = getDbPool()
  const hash = await hashPassword(data.contrasenia)
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.nombre, data.apellido, data.nombre_usuario, hash, data.tipo_usuario, data.celular, data.foto]
  )
  return { usuario_id: result.insertId }
}

// ===============================================================
// Actualizar usuario (rehash si incluye nueva contraseña)
// ===============================================================
export const updateUsuario = async (id, data) => {
  const pool = getDbPool()
  const updateData = { ...data }

  if (data.contrasenia) {
    updateData.contrasenia = await hashPassword(data.contrasenia)
  }

  await pool.query('UPDATE usuarios SET ? WHERE usuario_id = ?', [updateData, id])
  return { message: 'Usuario actualizado' }
}

// ===============================================================
// Soft delete (marca al usuario como inactivo)
// ===============================================================
export const softDeleteUsuario = async (id) => {
  const pool = getDbPool()
  await pool.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id])
}

// ===============================================================
// Obtener emails de administradores activos
// ===============================================================
export const obtenerEmailsAdministradores = async () => {
  const pool = getDbPool()
  const [rows] = await pool.query(
    'SELECT nombre_usuario FROM usuarios WHERE tipo_usuario = 1 AND activo = 1'
  )
  return rows.map(row => row.nombre_usuario)
}