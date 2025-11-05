import { body } from 'express-validator';
import { validate } from './index.js';

export const createReservaValidation = [
  body('fecha_reserva').isDate().withMessage('Fecha inválida'),
  body('salon_id').isInt({ min: 1 }),
  body('usuario_id').isInt({ min: 1 }),
  body('turno_id').isInt({ min: 1 }),
  body('importe_salon').isFloat({ min: 0 }),
  body('servicios').isArray().withMessage('Servicios debe ser un array'),
  validate
];

export const updateReservaValidation = [
  body('tematica').optional().isString(),
  body('foto_cumpleaniero').optional().isString(),
  body('activo').optional().isBoolean(),
  validate
];
