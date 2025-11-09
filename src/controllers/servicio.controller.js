import * as servicioService from '../services/servicio.service.js';
import { validationResult } from 'express-validator';
import { apicacheInstance } from '../config/cache.js';

// get servicios
export const getServicios = async (req, res, next) => {
  try {
    const servicios = await servicioService.listarServicios(); // ← cambio aquí
    res.status(200).json({ status: 'success', data: servicios });
  } catch (error) {
    next(error);
  }
};

// get servicio por ID
export const getServicio = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const servicio = await servicioService.obtenerServicio(id); // ← cambio aquí
    if (!servicio) return next(new Error('Servicio no encontrado'));
    res.status(200).json({ status: 'success', data: servicio });
  } catch (error) {
    next(error);
  }
};

// crear servicio
export const createServicio = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const id = await servicioService.crearServicio(req.body); // ← cambio aquí
    apicacheInstance.clear();
    res.status(201).json({ status: 'success', servicio_id: id });
  } catch (error) {
    next(error);
  }
};

// actualizar servicio
export const updateServicio = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const updated = await servicioService.actualizarServicio(id, req.body); // ← cambio aquí
    if (updated === 0) return next(new Error('No se pudo actualizar'));
    apicacheInstance.clear();
    res.status(200).json({ status: 'success', message: 'Servicio actualizado' });
  } catch (error) {
    next(error);
  }
};

// (softDelete)
export const deleteServicio = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const deleted = await servicioService.eliminarServicio(id); // ← cambio aquí
    if (deleted === 0) return next(new Error('No se pudo desactivar'));
    apicacheInstance.clear();
    res.status(200).json({ status: 'success', message: 'Servicio desactivado' });
  } catch (error) {
    next(error);
  }
};

// Endpoint para generar PDF (sin cambios)
import { generarPDFReserva } from '../utils/pdfGenerator.js';

export const generarReportePDF = async (req, res, next) => {
  try {
    const reserva = await reservaService.getDetalleCompleto(req.params.id); // tiene q incluir cliente, saloon, turno, servicios
    const path = `./docs/reporte_reserva_${reserva.id}.pdf`;

    generarPDFReserva(reserva, path);

    res.download(path); // descarga directa
  } catch (error) {
    next(error);
  }
};
