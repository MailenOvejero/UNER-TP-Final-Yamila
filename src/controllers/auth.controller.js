import jwt from 'jsonwebtoken';
import { buscarUsuarioPorEmail, validarPassword } from '../services/usuario.service.js'; 
import { ROLES } from '../config/roles.js';

/*
 * Genera un token JWT para el usuario autenticado.
 * Utiliza el ID y el rol para el payload.
 */
const generateToken = (user) => {
    const payload = {
        id: user.usuario_id,
        role: user.tipo_usuario
    };

    // Genera el token usando la clave secreta y la expiración de .env
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h' // Asume JWT_EXPIRES_IN en .env
    });
};

/**
 * Controlador para la ruta POST /api/auth/login
 */
export const login = async (req, res, next) => {

    // **********************************************************
    //  COMPROBACIÓN INICIAL (400 Bad Request)
    // **********************************************************
    const { nombre_usuario, password } = req.body;

    if (!nombre_usuario || !password) {
        const error = new Error('Faltan credenciales (usuario o contraseña).');
        error.status = 400;
        return next(error);
    }

    try {
        //  Buscar usuario
        const user = await buscarUsuarioPorEmail(nombre_usuario);

        // **********************************************************
        //  VALIDACIÓN DE USUARIO Y CONTRASEÑA (401 Unauthorized)
        // **********************************************************
        if (!user || !user.password) {
            const error = new Error('Usuario no encontrado o sin contraseña.');
            error.status = 401;
            return next(error);
        }

        const isPasswordValid = await validarPassword(password, user.password, user.usuario_id);

        // Si la contraseña es inválida:
        if (!isPasswordValid) {
            const error = new Error('Credenciales inválidas.'); // CREAR Error con un mensaje
            error.status = 401; // Asigna el N° de error 
            return next(error); // va al handler
        }

        //  Generar Token
        const token = generateToken(user);

        // Determinar el nombre del rol para la respuesta
        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        // comento para probar reservas en postman y modifico el codigo al igual que hice en roles.js
        // const roleName = Object.keys(ROLES).find(key => ROLES[key] === user.tipo_usuario);
        const roleName = Object.entries(ROLES).find(([_, value]) => value === user.tipo_usuario)?.[0];

        //  Respuesta exitosa con Token
        res.status(200).json({
            status: 'success',
            message: 'Autenticación exitosa',
            token: token,
            user: {
                id: user.usuario_id,
                username: user.nombre_usuario,
                role: roleName
            }
        });

    } catch (error) {
        // Los errores de base de datos o internos son atrapados aquí y enviados al errorHandler.
        next(error);
    }
};
