import { body } from 'express-validator';

export const createSalonValidation = [
    //  Validar "titulo" (VARCHAR(255), NOT NULL)
    body('titulo')
        .exists().withMessage('El título del salón es obligatorio.')
        .isString().withMessage('El título debe ser texto.')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('El título debe tener entre 3 y 255 caracteres.'),

    //  Validar "direccion" (VARCHAR(255), NOT NULL)
    body('direccion')
        .exists().withMessage('La dirección es obligatoria.')
        .isString().withMessage('La dirección debe ser texto.')
        .trim()
        .isLength({ min: 5, max: 255 }).withMessage('La dirección debe tener entre 5 y 255 caracteres.'),

    //  Validar "importe" (DECIMAL(10,2), NOT NULL)
    body('importe')
        .exists().withMessage('El importe del alquiler es obligatorio.')
        .isFloat({ gt: 0 }).withMessage('El importe debe ser un número decimal positivo.'),
        
    // Validar "capacidad" (INT)
    body('capacidad')
        .optional() 
        .isInt({ gt: 0 }).withMessage('La capacidad debe ser un número entero positivo.'),

    // Opcional: Validar latitud/longitud
    body('latitud').optional().isFloat().withMessage('La latitud debe ser un valor decimal.'),
    body('longitud').optional().isFloat().withMessage('La longitud debe ser un valor decimal.'),
];

export const updateSalonValidation = [
    // ojo es opcional, pero si exite tiene que ser válido
    body('titulo')
        .optional() 
        .isString().withMessage('El título debe ser texto.')
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('El título debe tener entre 3 y 255 caracteres.'),

    // Validar "direccion"
    body('direccion')
        .optional()
        .isString().withMessage('La dirección debe ser texto.')
        .trim()
        .isLength({ min: 5, max: 255 }).withMessage('La dirección debe tener entre 5 y 255 caracteres.'),

    // Validar "importe"
    body('importe')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El importe debe ser un número decimal positivo.'),
        
    // Validar "capacidad"
    body('capacidad')
        .optional() 
        .isInt({ gt: 0 }).withMessage('La capacidad debe ser un número entero positivo.'),

    //  Validar "activo" - para el (softdelete)
    body('activo')
        .optional() 
        .isBoolean().withMessage('El campo activo debe ser un booleano (true/false o 1/0).'),
        
    // Validar latitud/longitud
    body('latitud').optional().isFloat().withMessage('La latitud debe ser un valor decimal.'),
    body('longitud').optional().isFloat().withMessage('La longitud debe ser un valor decimal.'),
];