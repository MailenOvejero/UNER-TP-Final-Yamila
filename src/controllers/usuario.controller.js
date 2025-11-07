import { createUser as createUserService } from '../services/usuario.service.js';

/**
 * Controlador para crear un nuevo usuario.
 * Llama al servicio para la creación y responde con el resultado.
 */
export const createUser = async (req, res, next) => {
    // Aquí iría la validación de datos con express-validator (paso futuro)

    try {
        // Los datos del nuevo usuario vienen en el cuerpo de la petición
        const newUser = req.body;

        // Llamamos al servicio que contiene la lógica de negocio
        const createdUser = await createUserService(newUser);

        // Respondemos con un estado 201 (Created) y los datos del usuario creado
        res.status(201).json({
            status: 'success',
            message: 'Usuario creado exitosamente.',
            data: createdUser
        });
    } catch (error) {
        // Si algo sale mal, pasamos el error al manejador de errores global
        next(error);
    }
};