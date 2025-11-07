import * as reservaService from '../services/reserva.service.js';
import { obtenerEstadisticas } from '../services/reserva.service.js';
import { generarCSVReservas } from '../utils/csvGenerator.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js'; 
import { getDbPool } from '../config/db.js'; // necesario para consultas extra
import { generarPDFReserva } from '../utils/pdfGenerator.js';
import { apicacheInstance } from '../config/cache.js';

export const getReservas = async (req, res, next) => {
  try {
    const reservas = await reservaService.listarReservas();
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

export const getReservaById = async (req, res, next) => {
  try {
    const reserva = await reservaService.obtenerReserva(req.params.id);
    if (!reserva) throw new Error('Reserva no encontrada');
    res.status(200).json(reserva);
  } catch (error) {
    next(error);
  }
};

export const getReservasDelCliente = async (req, res, next) => {
  try {
    const usuario_id = req.user.id;
    const reservas = await reservaService.obtenerReservasDelUsuario(usuario_id);
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

export const createReserva = async (req, res, next) => {
  try {
    const nuevaReserva = await reservaService.crearReserva(req.body);

    const { reserva_id } = nuevaReserva;

    const pool = getDbPool();

    // Obtener datos completos de la reserva recién creada
    const [rows] = await pool.query(`
      SELECT 
        r.fecha_reserva,
        r.tematica,
        r.importe_total,
        u.nombre,
        u.apellido,
        u.nombre_usuario AS email,
        s.titulo AS salon,
        t.hora_desde,
        t.hora_hasta
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      WHERE r.reserva_id = ?
    `, [reserva_id]);

    const reserva = rows[0];

    // Enviar correo al cliente
    await enviarNotificacionReserva(
      reserva.email,
      'Confirmación de tu reserva',
      'confirmacionReserva',
      reserva
    );

    // ---- Nuevo: enviar correo a todos los administradores reales ----
    try {
      const [admins] = await pool.query(`
        SELECT nombre_usuario AS email FROM usuarios WHERE tipo_usuario = 1 AND activo = 1
      `);
      const asuntoAdmin = `Nueva Reserva Creada (ID: ${reserva_id})`;

      for (const admin of admins) {
        await enviarNotificacionReserva(
          admin.email,
          asuntoAdmin,
          'notificacionAdmin',
          { ...reserva, asunto: asuntoAdmin }
        );
      }
    } catch (adminQueryErr) {
      console.error('[NOTIFICACIÓN] Error obteniendo correos de administradores:', adminQueryErr.message);
    }
    apicacheInstance.clear();
    res.status(201).json(nuevaReserva);
  } catch (error) {
    next(error);
  }
};

export const updateReserva = async (req, res, next) => {
  try {
    const actualizada = await reservaService.actualizarReserva(req.params.id, req.body);
    apicacheInstance.clear();
    res.status(200).json(actualizada);
  } catch (error) {
    next(error);
  }
};

export const deleteReserva = async (req, res, next) => {
  try {
    await reservaService.eliminarReserva(req.params.id);
    apicacheInstance.clear();
    res.status(200).json({ message: 'Reserva desactivada' });
  } catch (error) {
    next(error);
  }
};

//CREO EL CONTROLADOR 
export const estadisticasReservas = async (req, res, next) => {
  try {
    const data = await obtenerEstadisticas();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

//creo endpoint para exportar CSV 
export const generarReporteCSV = async (req, res, next) => {
  try {
    const reservas = await reservaService.obtenerReservasParaCSV(); // devuelve reservas con datos completos
    const path = './docs/reservas.csv';

    generarCSVReservas(reservas, path);

    res.download(path); // descarga directa
  } catch (error) {
    next(error);
  }
};

//creo endpoint para exportar PDF con datos completos
export const generarReportePDF = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const reserva = await reservaService.obtenerReserva(reserva_id);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const pool = getDbPool();

    // Obtener cliente
    const [[cliente]] = await pool.query(`
      SELECT CONCAT(nombre, ' ', apellido) AS cliente
      FROM usuarios
      WHERE usuario_id = ?
    `, [reserva.usuario_id]);

    // Obtener salón
    const [[salon]] = await pool.query(`
      SELECT titulo FROM salones WHERE salon_id = ?
    `, [reserva.salon_id]);

    // Obtener turno
    const [[turno]] = await pool.query(`
      SELECT hora_desde, hora_hasta FROM turnos WHERE turno_id = ?
    `, [reserva.turno_id]);

    // Obtener servicios
    const [servicios] = await pool.query(`
      SELECT s.descripcion, rs.importe
      FROM reservas_servicios rs
      JOIN servicios s ON rs.servicio_id = s.servicio_id
      WHERE rs.reserva_id = ?
    `, [reserva_id]);

    // Armar objeto completo para el PDF
    const reservaCompleta = {
      cliente: cliente.cliente,
      salon: salon.titulo,
      turno: `${turno.hora_desde} a ${turno.hasta}`,
      fecha_reserva: reserva.fecha_reserva,
      tematica: reserva.tematica,
      importe_total: reserva.importe_total,
      servicios: servicios
    };

    const path = `./docs/reserva_${reserva_id}.pdf`;
    await generarPDFReserva(reservaCompleta, path);

    res.download(path);
  } catch (error) {
    next(error);
  }
};
