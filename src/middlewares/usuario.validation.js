import { body } from 'express-validator';

export const createUsuarioValidation = [
  body('nombre').isString().isLength({ min: 2 }),
  body('apellido').isString().isLength({ min: 2 }),
  body('nombre_usuario').isEmail(),
  body('contrasenia').isLength({ min: 4 }),
  body('tipo_usuario').isInt({ min: 1, max: 3 }),
];

export const updateUsuarioValidation = [
  body('nombre').optional().isString(),
  body('apellido').optional().isString(),
  body('celular').optional().isString(),
  body('foto').optional().isString(),
  body('activo').optional().isBoolean(),
];
