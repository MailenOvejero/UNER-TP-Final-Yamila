import * as servicioService from '../services/servicio.service.js';
import { validationResult } from 'express-validator';

export const getServicios = async (req, res, next) => {
  try {
    const servicios = await servicioService.getAllServicios();
    res.status(200).json({ status: 'success', data: servicios });
  } catch (error) {
    next(error);
  }
};

export const getServicio = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const servicio = await servicioService.getServicioById(id);
    if (!servicio) return next(new Error('Servicio no encontrado'));
    res.status(200).json({ status: 'success', data: servicio });
  } catch (error) {
    next(error);
  }
};

export const createServicio = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const id = await servicioService.createServicio(req.body);
    res.status(201).json({ status: 'success', servicio_id: id });
  } catch (error) {
    next(error);
  }
};

export const updateServicio = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new Error('Datos inválidos'));
  try {
    const updated = await servicioService.updateServicio(id, req.body);
    if (updated === 0) return next(new Error('No se pudo actualizar'));
    res.status(200).json({ status: 'success', message: 'Servicio actualizado' });
  } catch (error) {
    next(error);
  }
};

export const deleteServicio = async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return next(new Error('ID inválido'));
  try {
    const deleted = await servicioService.deleteServicio(id);
    if (deleted === 0) return next(new Error('No se pudo desactivar'));
    res.status(200).json({ status: 'success', message: 'Servicio desactivado' });
  } catch (error) {
    next(error);
  }
};



//creo endpoint para generar pdf
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
