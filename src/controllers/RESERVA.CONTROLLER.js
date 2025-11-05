import * as reservaService from '../services/RESERVA.SERVICE.js';
import { getEstadisticasReservas } from '../services/RESERVA.SERVICE.js';
import { generarCSVReservas } from '../utils/csvGenerator.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js';
import { getDbPool } from '../config/db.js'; // necesario para consultas extra
import { generarPDFReserva } from '../utils/pdfGenerator.js';

export const getReservas = async (req, res, next) => {
  try {
    const reservas = await reservaService.getAll();
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

export const getReservaById = async (req, res, next) => {
  try {
    const reserva = await reservaService.getById(req.params.id);
    if (!reserva) throw new Error('Reserva no encontrada');
    res.status(200).json(reserva);
  } catch (error) {
    next(error);
  }
};

export const getReservasDelCliente = async (req, res, next) => {
  try {
    const usuario_id = req.user.id;
    const reservas = await reservaService.getByUsuario(usuario_id);
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

export const createReserva = async (req, res, next) => {
  try {
    const nuevaReserva = await reservaService.create(req.body);
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

    // Armar mensaje personalizado
    const mensaje = `
      Hola ${reserva.nombre} ${reserva.apellido},<br><br>
      Tu reserva fue confirmada para el día ${reserva.fecha_reserva} en el salón "${reserva.salon}".<br>
      Turno: ${reserva.hora_desde} a ${reserva.hora_hasta}<br>
      Temática: ${reserva.tematica || 'Sin temática'}<br>
      Importe total: $${reserva.importe_total}<br><br>
      Gracias por confiar en nosotros 🎉
    `;

    // Enviar correo al cliente
    await enviarNotificacionReserva({
      destinatario: reserva.email,
      asunto: 'Confirmación de reserva',
      mensaje,
    });

    // notificación automatica simulada
    const clienteId = req.user.id;
    console.log(`[NOTIFICACIÓN] Reserva confirmada para el cliente ID ${clienteId}`);
    console.log(`[NOTIFICACIÓN] Administrador notificado sobre la nueva reserva ID ${reserva_id}`);
    console.log(`[NOTIFICACIÓN] Correo enviado a ${reserva.email} por reserva ID ${reserva_id}`);

    res.status(201).json(nuevaReserva);
  } catch (error) {
    next(error);
  }
};

export const updateReserva = async (req, res, next) => {
  try {
    const actualizada = await reservaService.update(req.params.id, req.body);
    res.status(200).json(actualizada);
  } catch (error) {
    next(error);
  }
};

export const deleteReserva = async (req, res, next) => {
  try {
    await reservaService.softDelete(req.params.id);
    res.status(200).json({ message: 'Reserva desactivada' });
  } catch (error) {
    next(error);
  }
};

//CREO EL CONTROLADOR 
export const estadisticasReservas = async (req, res, next) => {
  try {
    const data = await getEstadisticasReservas();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

//creo endpoint para exportar CSV 
export const generarReporteCSV = async (req, res, next) => {
  try {
    const reservas = await reservaService.getReservasParaCSV(); // devuelve reservas con datos completos
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
    const reserva = await reservaService.getById(reserva_id);

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
      turno: `${turno.hora_desde} a ${turno.hora_hasta}`,
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
