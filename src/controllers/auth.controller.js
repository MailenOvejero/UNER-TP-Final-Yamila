import jwt from 'jsonwebtoken';
import { buscarUsuarioPorEmail, validarPassword, registerClient } from '../services/usuario.service.js';
import { ROLES } from '../config/roles.js';
import { validationResult } from 'express-validator';

// Genera un token JWT para el usuario autenticado.
// Utiliza el ID y el rol para el payload.
const generateToken = (user) => {
    const payload = {
        id: user.usuario_id,
        role: user.tipo_usuario
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
};

// Controlador para la ruta POST /api/auth/login
export const login = async (req, res, next) => {
    const { nombre_usuario, password, contrasenia } = req.body;
    const passwordIngresada = (password || contrasenia)?.trim();


    //  Validación inicial
    if (!nombre_usuario || !passwordIngresada) {
        const error = new Error('Faltan credenciales (usuario o contraseña).');
        error.status = 400;
        return next(error);
    }
    //  Buscar usuario en la BD
    try {

        const user = await buscarUsuarioPorEmail(nombre_usuario);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        //  check del hash
        const userHashedPassword = user.hashedPassword?.trim();

        if (!userHashedPassword) {
            return res.status(400).json({ error: 'El usuario no tiene una contraseña registrada' });
        }

        //  comparo contraseñas
        console.log('🧩 Comparando contraseña...');
        console.log('Ingresada:', passwordIngresada);
        console.log('Hash DB:', userHashedPassword);

        const isPasswordValid = await validarPassword(passwordIngresada, userHashedPassword, user.usuario_id);

        if (!isPasswordValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        console.log('Contraseña correcta');

        // 🎟️ genero token JWT
        const token = generateToken(user);

        const roleName = Object.entries(ROLES).find(([_, value]) => value === user.tipo_usuario)?.[0];

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
        next(error);
    }
};

//  registro de Cliente
export const registerClientController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new Error('Datos de registro inválidos.');
        validationError.status = 400;
        validationError.details = errors.array();
        return next(validationError);
    }

    try {
        //  Registro cliente (rol 3)
        const newClient = await registerClient(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Cliente registrado exitosamente.',
            user: {
                id: newClient.usuario_id,
                nombre_usuario: req.body.nombre_usuario,
                role: 'CLIENTE'
            }
        });

    } catch (error) {
        next(error);
    }
};
