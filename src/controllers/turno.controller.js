import * as turnoService from '../services/turno.service.js';
import { validationResult } from 'express-validator';
import { apicacheInstance } from '../config/cache.js';

// get turnos activos
export const getTurnos = async (req, res, next) => {
  try {
    const turnos = await turnoService.listarTurnos(); // nombre corregido
    res.status(200).json({ status: 'success', data: turnos });
  } catch (error) {
    next(error);
  }
};

// turno por ID
export const getTurno = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const turno = await turnoService.obtenerTurno(id); // nombre corregido
    if (!turno) return next(new Error('Turno no encontrado'));
    res.status(200).json({ status: 'success', data: turno });
  } catch (error) {
    next(error);
  }
};

// crear turno
export const createTurno = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const id = await turnoService.crearTurno(req.body); // nombre corregido
    apicacheInstance.clear();
    res.status(201).json({ status: 'success', turno_id: id });
  } catch (error) {
    next(error);
  }
};

//  Actualizar turno
export const updateTurno = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const updated = await turnoService.actualizarTurno(id, req.body); // nombre corregido
    if (updated === 0) return next(new Error('No se pudo actualizar'));
    apicacheInstance.clear();
    res.status(200).json({ status: 'success', message: 'Turno actualizado' });
  } catch (error) {
    next(error);
  }
};

//  (softDelete)
export const deleteTurno = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const deleted = await turnoService.eliminarTurno(id); // nombre corregido q no nos funcionaba
    if (deleted === 0) return next(new Error('No se pudo desactivar'));
    apicacheInstance.clear();
    res.status(200).json({ status: 'success', message: 'Turno desactivado' });
  } catch (error) {
    next(error);
  }
};
