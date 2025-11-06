import { body } from 'express-validator';

export const createServicioValidation = [
  body('descripcion')
    .exists().withMessage('La descripción es obligatoria.')
    .isString().withMessage('Debe ser texto.')
    .trim()
    .isLength({ min: 3, max: 255 }).withMessage('Debe tener entre 3 y 255 caracteres.'),

  body('importe')
    .exists().withMessage('El importe es obligatorio.')
    .isFloat({ gt: 0 }).withMessage('Debe ser un número positivo.')
];

export const updateServicioValidation = [
  body('descripcion')
    .optional()
    .isString().withMessage('Debe ser texto.')
    .trim()
    .isLength({ min: 3, max: 255 }),

  body('importe')
    .optional()
    .isFloat({ gt: 0 }),

  body('activo')
    .optional()
    .isBoolean().withMessage('Debe ser booleano (true/false o 1/0).')
];
