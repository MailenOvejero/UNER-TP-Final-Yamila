import * as usuarioService from '../services/usuario.service.js';
import { validationResult } from 'express-validator';
import { apicacheInstance } from '../config/cache.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js';


export const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.getAll();
    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req, res, next) => {
  try {
    const usuario = await usuarioService.getById(req.params.id);
    if (!usuario) throw new Error('Usuario no encontrado');
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

export const createUsuario = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const nuevoUsuario = await usuarioService.create(req.body);
    apicacheInstance.clear();

    // Enviar correo de bienvenida
    try {
      await enviarNotificacionReserva(
        nuevoUsuario.nombre_usuario, // El email del nuevo usuario
        '¡Bienvenido/a a nuestra plataforma!',
        'bienvenida',
        { nombre: nuevoUsuario.nombre } // Datos para la plantilla
      );
    } catch (emailError) {
      console.error(`[REGISTRO] Usuario ${nuevoUsuario.usuario_id} creado, pero falló el envío de correo: ${emailError.message}`);
    }
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const actualizado = await usuarioService.update(req.params.id, req.body);
    apicacheInstance.clear();
    res.status(200).json(actualizado);
  } catch (error) {
    next(error);
  }
};

export const deleteUsuario = async (req, res, next) => {
  try {
    await usuarioService.softDelete(req.params.id);
    apicacheInstance.clear();
    res.status(200).json({ message: 'Usuario desactivado' });
  } catch (error) {
    next(error);
  }
};
