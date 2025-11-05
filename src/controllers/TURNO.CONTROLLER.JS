import * as turnoService from '../services/turno.service.js';

import { validationResult } from 'express-validator';

export const getTurnos = async (req, res, next) => {
  try {
    const turnos = await turnoService.getAllTurnos();
    res.status(200).json({ status: 'success', data: turnos });
  } catch (error) {
    next(error);
  }
};

export const getTurno = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const turno = await turnoService.getTurnoById(id);
    if (!turno) return next(new Error('Turno no encontrado'));
    res.status(200).json({ status: 'success', data: turno });
  } catch (error) {
    next(error);
  }
};

export const createTurno = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const id = await turnoService.createTurno(req.body);
    res.status(201).json({ status: 'success', turno_id: id });
  } catch (error) {
    next(error);
  }
};

export const updateTurno = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const updated = await turnoService.updateTurno(id, req.body);
    if (updated === 0) return next(new Error('No se pudo actualizar'));
    res.status(200).json({ status: 'success', message: 'Turno actualizado' });
  } catch (error) {
    next(error);
  }
};

export const deleteTurno = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const deleted = await turnoService.deleteTurno(id);
    if (deleted === 0) return next(new Error('No se pudo desactivar'));
    res.status(200).json({ status: 'success', message: 'Turno desactivado' });
  } catch (error) {
    next(error);
  }
};
