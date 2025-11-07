import { createUser as createUserService } from '../services/usuario.service.js';

/**
 * Controlador para crear un nuevo usuario.
 * Llama al servicio para la creación y responde con el resultado.
 */
export const createUser = async (req, res, next) => {
  try {
    const newUser = req.body;

    // Validar campos obligatorios antes de crear el usuario
    if (!newUser.password) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña es obligatoria.',
      });
    }

    if (!newUser.nombre_usuario || !newUser.nombre) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre y el email son obligatorios.',
      });
    }

    // Crear usuario en la base de datos
    const createdUser = await createUserService(newUser);

    // Responder con el usuario creado
    res.status(201).json({
      status: 'success',
      message: 'Usuario creado exitosamente.',
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
};
