import { body } from 'express-validator';
import { validate } from './index.js';

export const createReservaValidation = [
  body('fecha_reserva').isDate().withMessage('El formato de fecha de reserva es inválido.'),
  
  // con isNumeric() validamos los campos que vienen como strings numéricos
  body('salon_id').isNumeric().withMessage('El ID del salón debe ser un número.'),
  body('usuario_id').isNumeric().withMessage('El ID del usuario debe ser un número.'),
  body('turno_id').isNumeric().withMessage('El ID del turno debe ser un número.'),
  body('importe_salon').isNumeric().withMessage('El importe del salón debe ser numérico.'),
  
  // validamos el JSon antes que el controlador la use.
  body('servicios')
    .custom(value => {
      try {
        const json = JSON.parse(value);
        return Array.isArray(json); // Vemos si el JSON esta en formato stringfy y sea un array
      } catch (e) {
        return false;
      }
    })
    .withMessage('El campo servicios debe ser un array JSON stringificado válido.'),
];

export const updateReservaValidation = [
  body('tematica').optional().isString(),
  body('foto_cumpleaniero').optional().isString(),
  body('activo').optional().isBoolean(),
  validate
];
