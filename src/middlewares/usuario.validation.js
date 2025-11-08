import { body } from 'express-validator';
import { validate } from './validate.js'; // SOLUCIÓN: Importar el middleware de manejo de errores

export const createUsuarioValidation = [
  body('nombre').isString().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
  body('apellido').isString().isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
  body('nombre_usuario').isEmail().withMessage('El formato de email es inválido.'),
  body('contrasenia').isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres.'),
  // Este campo es ignorado/sobrescrito en el registro de cliente, pero se mantiene la validación para uso interno/admin.
  body('tipo_usuario').optional().isInt({ min: 1, max: 3 }).withMessage('Tipo de usuario debe ser 1, 2 o 3.'), 
  
  // El middleware de validación final
  validate
];

export const updateUsuarioValidation = [
  body('nombre').optional().isString(),
  body('apellido').optional().isString(),
  body('celular').optional().isString(),
  body('foto').optional().isString(),
  body('activo').optional().isBoolean(),
  
  // El middleware de validación final
  validate
];