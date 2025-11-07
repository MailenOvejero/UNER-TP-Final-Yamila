import * as usuarioService from '../services/usuario.service.js';
import { validationResult } from 'express-validator';
import { apicacheInstance } from '../config/cache.js';


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
    const nuevo = await usuarioService.create(req.body);
    apicacheInstance.clear();
    res.status(201).json(nuevo);
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
