import { body } from 'express-validator';

export const createTurnoValidation = [
  body('orden').exists().isInt({ min: 1 }).withMessage('Orden debe ser entero positivo'),
  body('hora_desde').exists().isString().withMessage('Hora desde es obligatoria'),
  body('hora_hasta').exists().isString().withMessage('Hora hasta es obligatoria')
];

export const updateTurnoValidation = [
  body('orden').optional().isInt({ min: 1 }),
  body('hora_desde').optional().isString(),
  body('hora_hasta').optional().isString(),
  body('activo').optional().isBoolean()
];
