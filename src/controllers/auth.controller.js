import jwt from 'jsonwebtoken';
import { buscarUsuarioPorEmail, validarPassword, registerClient } from '../services/usuario.service.js'; // ⬅️ MODIFICADO: Agrego registerClient
import { ROLES } from '../config/roles.js';
import { validationResult } from 'express-validator'; // NUEVO: Para manejar validación de Express

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
    const { nombre_usuario, password, contrasenia } = req.body;
    const passwordIngresada = password || contrasenia;

    if (!nombre_usuario || !passwordIngresada) {
        const error = new Error('Faltan credenciales (usuario o contraseña).');
        error.status = 400;
        return next(error);
    }

    try {
        //  Buscar usuario
        const user = await buscarUsuarioPorEmail(nombre_usuario);

        console.log('Usuario encontrado:', user);

        // FIX DE LOGIN: Usamos user.hashedPassword (del alias en la BD) y validamos que exista.
        const userHashedPassword = user ? user.hashedPassword : null;

        //  Verificar usuario y contraseña en una sola condición (401 Unauthorized)
        const isPasswordValid = user && userHashedPassword && await validarPassword(passwordIngresada, userHashedPassword, user.usuario_id);

        // Si NO hay usuario O la contraseña es inválida:
        if (!isPasswordValid) {
            const error = new Error('Credenciales inválidas.'); // CREAR Error con un mensaje
            error.status = 401; // Asigna el N° de error
            return next(error); // va al handler
        }

        //  Generar Token
        const token = generateToken(user);

        // Determinar el nombre del rol para la respuesta
        const roleName = Object.entries(ROLES).find(([_, value]) => value === user.tipo_usuario)?.[0];

        //  Respuesta exitosa con Token
        res.status(200).json({
            status: 'success',
            message: 'Autenticación exitosa',
            token: token,
            user: {
                id: user.usuario_id,
                nombre_usuario: user.nombre_usuario,
                role: roleName
            }
        });

    } catch (error) {
        // Los errores de base de datos o internos son atrapados aquí y enviados al errorHandler.
        next(error);
    }
};

// ===============================================================
// NUEVO CONTROLADOR: Registro de Cliente
// ===============================================================

/**
 * Controlador para la ruta POST /api/auth/registro/cliente
 */
export const registerClientController = async (req, res, next) => {
    // 1. Verificar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new Error('Datos de registro inválidos.');
        validationError.status = 400; // Bad Request
        validationError.details = errors.array();
        return next(validationError);
    }
    
    // El servicio esperará los datos necesarios (nombre, apellido, nombre_usuario, contrasenia, celular, foto)
    try {
        // 2. Llamar a la lógica de negocio (el service se encarga de asignar el rol 3)
        const newClient = await registerClient(req.body); 

        // 3. Respuesta de éxito
        res.status(201).json({
            status: 'success',
            message: 'Cliente registrado exitosamente.',
            user: {
                id: newClient.usuario_id,
                nombre_usuario: req.body.nombre_usuario,
                role: 'CLIENTE' // Información clara del rol asignado
            }
        });

    } catch (error) {
        // 4. Pasar errores de negocio (ej. email ya existe 409) al handler centralizado
        next(error); 
    }
};