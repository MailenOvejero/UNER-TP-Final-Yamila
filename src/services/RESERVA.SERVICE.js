import { getDbPool } from '../config/db.js';
// Importación ajustada para encontrar el repositorio en src/data
import * as reservaRepo from '../data/RESERVA.REPOSITORY.js';

export const getAll = async () => {
  return reservaRepo.findAll();
};

export const getById = async (id) => {
  return reservaRepo.findById(id);
};

export const getByUsuario = async (usuario_id) => {
  return reservaRepo.findByUsuario(usuario_id);
};

// Lógica de Negocio: Transacción para la creación de una reserva
export const create = async (data) => {
  const {
    fecha_reserva, salon_id, usuario_id, turno_id,
    foto_cumpleaniero, tematica, importe_salon, servicios
  } = data;

  const pool = getDbPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Insertar la reserva principal
    const reserva_id = await reservaRepo.insertReserva(conn, {
        fecha_reserva, salon_id, usuario_id, turno_id,
        foto_cumpleaniero, tematica, importe_salon
    });

    let totalServicios = 0;

    // 2. Insertar los servicios asociados y calcular el total
    for (const servicio of servicios) {
      await reservaRepo.insertReservaServicio(conn, reserva_id, servicio);
      totalServicios += servicio.importe;
    }

    const importe_total = importe_salon + totalServicios;

    // 3. Actualizar el importe total de la reserva
    await reservaRepo.updateReservaTotal(conn, reserva_id, importe_total);

    await conn.commit();
    return { reserva_id, importe_total };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

export const update = async (id, data) => {
  await reservaRepo.updateReserva(id, data);
  return { message: 'Reserva actualizada' };
};

export const softDelete = async (id) => {
  await reservaRepo.deactivateReserva(id);
};

export const getEstadisticasReservas = async () => {
  return reservaRepo.findEstadisticasReservas();
};

export const getReservasParaCSV = async () => {
  return reservaRepo.findReservasParaCSV();
};