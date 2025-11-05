import * as salonService from '../services/salon.service.js';
import { validationResult } from 'express-validator';

// ============================================================
// BROWSE: Obtener todos los salones (GET /api/salones)
// ============================================================
export const getSalones = async (req, res, next) => {
    // Obtener parámetros de paginación
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const order = req.query.order || 'titulo';
    const asc = (req.query.asc === 'false') ? false : true; 
    
    //  Validación básica de parámetros
    if (limit < 1 || offset < 0) {
        const error = new Error('Los parámetros limit y offset deben ser valores positivos.');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        //  Llamar al servicio
        const salones = await salonService.getAllSalones({ limit, offset, order, asc });

        //  Respuesta exitosa
        res.status(200).json({
            status: 'success',
            count: salones.length,
            data: salones
        });
        
    } catch (error) {
        next(error);
    }
};

// ============================================================
// READ: Obtener un salón por ID (GET /api/salones/:id)
// ============================================================
export const getSalon = async (req, res, next) => {
    
    const salonId = parseInt(req.params.id); 

    //  Validación de ID
    if (isNaN(salonId) || salonId <= 0) {
        const error = new Error('ID de salón inválido. Debe ser un número positivo.');
        error.status = 400; // Bad Request
        return next(error); 
    }

    try {
        //  Llamar al servicio
        const salon = await salonService.getSalonById(salonId); 

        //  Manejo de 404 Not Found (si no existe o está inactivo)
        if (!salon) {
            const error = new Error(`Salón con ID ${salonId} no encontrado o inactivo.`);
            error.status = 404; // Not Found
            return next(error); 
        }

        //  Respuesta exitosa
        res.status(200).json({
            status: 'success',
            data: salon
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// ADD: Crear un nuevo salón (POST /api/salones)
// ============================================================
export const createSalon = async (req, res, next) => {
    
    //  Verificar errores de validación
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const error = new Error('Error de validación en los datos del salón.');
        error.status = 400; // Bad Request
        error.details = errors.array(); 
        return next(error);
    }

    try {
        //  Llamar al servicio
        const newSalonId = await salonService.createSalon(req.body);

        // Respuesta exitosa
        res.status(201).json({
            status: 'success',
            message: 'Salón creado exitosamente',
            salonId: newSalonId,
            data: { ...req.body, salon_id: newSalonId }
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// EDIT: Actualizar un salón (PUT /api/salones/:id)
// ============================================================
export const updateSalon = async (req, res, next) => {
    
    const salonId = parseInt(req.params.id);

    //  Validación de ID y errores de validación de express-validator
    if (isNaN(salonId) || salonId <= 0) {
        const error = new Error('ID de salón inválido. Debe ser un número positivo.');
        error.status = 400; 
        return next(error);
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Error de validación en los datos de actualización.');
        error.status = 400; 
        error.details = errors.array(); 
        return next(error);
    }
    
    // Verificar que el body no esté vacío
    if (Object.keys(req.body).length === 0) {
        const error = new Error('No se proporcionaron datos para actualizar.');
        error.status = 400; 
        return next(error);
    }

    try {
        //  Llamar al servicio
        const affectedRows = await salonService.updateSalon(salonId, req.body);
        
        //  Manejo de 404
        if (affectedRows === 0) {
            const error = new Error(`No se encontró o no se pudo actualizar el salón con ID ${salonId}.`);
            error.status = 404;
            return next(error);
        }

        // Respuesta exitosa
        res.status(200).json({
            status: 'success',
            message: `Salón con ID ${salonId} actualizado exitosamente.`,
        });

    } catch (error) {
        next(error);
    }
};

// ============================================================
// DELETE: Desactivar salón (DELETE /api/salones/:id)
// ============================================================
export const deleteSalon = async (req, res, next) => {
    
    const salonId = parseInt(req.params.id); 

    // Validación de ID
    if (isNaN(salonId) || salonId <= 0) {
        const error = new Error('ID de salón inválido. Debe ser un número positivo.');
        error.status = 400; // Bad Request
        return next(error);
    }

    try {
        //  Llamar al servicio para realizar soft delete
        const affectedRows = await salonService.deleteSalon(salonId); 

        // Manejo de 404
        if (affectedRows === 0) {
            const error = new Error(`No se encontró un salón activo con ID ${salonId} para desactivar.`);
            error.status = 404;
            return next(error);
        }

        //  Respuesta exitosa
        res.status(200).json({
            status: 'success',
            message: `Salón con ID ${salonId} desactivado (soft delete) exitosamente.`,
        });

    } catch (error) {
        next(error);
    }
};
