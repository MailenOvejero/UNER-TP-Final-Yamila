import * as reservaService from '../services/reserva.service.js';
import { obtenerEstadisticas } from '../services/reserva.service.js';
import { generarCSVReservas } from '../utils/csvGenerator.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js';
import { getDbPool } from '../config/db.js';
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

// ----------------------------------------------------
// FUNCIÓN MODIFICADA PARA MANEJAR COMPROBANTES DE PAGO
// ----------------------------------------------------
const createReservaConComprobante = async (req, res, next) => {
  try {
    // 1. Manejo del archivo subido por Multer
    const rutaComprobante = req.file ? req.file.path : null;

    // 2. Validación: el comprobante debe ser obligatorio
    if (!rutaComprobante) {
      return res.status(400).json({ error: 'El comprobante de pago es obligatorio.' });
    }

    // 3. Parseo de datos de texto. En multipart/form-data, todos los campos llegan como string.
    const datosReserva = {
      ...req.body,
      servicios: req.body.servicios ? JSON.parse(req.body.servicios) : [],
      importe_salon: req.body.importe_salon ? Number(req.body.importe_salon) : 0,
      ruta_comprobante: rutaComprobante,
    };
    
    // 4. Crear la reserva
    const nuevaReserva = await reservaService.crearReserva(datosReserva);

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
      Importe total: $${reserva.importe_total}<br>
      ¡Comprobante de pago subido con éxito!<br><br>
      Gracias por confiar en nosotros 🎉
    `;

    // Enviar correo al cliente
    await enviarNotificacionReserva({
      destinatario: reserva.email,
      asunto: 'Confirmación de reserva',
      mensaje,
    });

    // ---- Notificación a administradores ----
    try {
      const [admins] = await pool.query(`
        SELECT nombre_usuario AS email FROM usuarios WHERE tipo_usuario = 1 AND activo = 1
      `);

      for (const admin of admins) {
        try {
          await enviarNotificacionReserva({
            destinatario: admin.email,
            asunto: 'Nueva reserva creada',
            mensaje: `Se ha creado una nueva reserva (ID ${reserva_id}) para el cliente ${reserva.nombre} ${reserva.apellido}.<br>Fecha: ${reserva.fecha_reserva}<br>Salón: ${reserva.salon}<br>Turno: ${reserva.hora_desde} a ${reserva.hora_hasta}<br>Importe total: $${reserva.importe_total}<br>Comprobante guardado en: ${rutaComprobante}`
          });
          console.log(`[NOTIFICACIÓN] Correo enviado a ${admin.email}`);
        } catch (mailErr) {
          console.error(`[NOTIFICACIÓN] Error enviando correo a ${admin.email}:`, mailErr.message);
        }
      }
    } catch (adminQueryErr) {
      console.error('[NOTIFICACIÓN] Error obteniendo correos de administradores:', adminQueryErr.message);
    }
    // ------------------------------------------------

    apicacheInstance.clear();
    res.status(201).json(nuevaReserva);
  } catch (error) {
    next(error);
  }
};
// ----------------------------------------------------
// FIN FUNCIÓN MODIFICADA
// ----------------------------------------------------

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
    const reservas = await reservaService.obtenerReservasParaCSV();
    const path = './docs/reservas.csv';

    generarCSVReservas(reservas, path);

    res.download(path);
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

// ====================================================
// 📦 NUEVOS ENDPOINTS PROFESIONALES PARA DESCARGAR CSV
// ====================================================

// Descargar todas las reservas en CSV
export const descargarCSVReservas = async (req, res, next) => {
  try {
    const reservas = await reservaService.obtenerReservasParaCSV();

    if (!reservas || reservas.length === 0) {
      return res.status(404).json({ message: 'No hay reservas registradas.' });
    }

    // Convertir el array en texto CSV
    let csv = '"reserva_id","cliente","salon","turno","fecha_reserva","importe_total"\n';
    reservas.forEach(r => {
      csv += `${r.reserva_id},"${r.cliente}","${r.salon}","${r.turno}","${r.fecha_reserva}","${r.importe_total}"\n`;
    });

    // Headers para forzar descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="reservas.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// Descargar una sola reserva por ID en CSV
export const descargarCSVReservaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reserva = await reservaService.obtenerReserva(id);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Consultar info completa para el CSV
    const pool = getDbPool();
    const [[info]] = await pool.query(`
      SELECT 
        r.reserva_id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        s.titulo AS salon,
        CONCAT(t.hora_desde, ' a ', t.hora_hasta) AS turno,
        r.fecha_reserva,
        r.importe_total
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      WHERE r.reserva_id = ?
    `, [id]);

    // Crear CSV simple con encabezados
    const csv = `"reserva_id","cliente","salon","turno","fecha_reserva","importe_total"\n` +
                `${info.reserva_id},"${info.cliente}","${info.salon}","${info.turno}","${info.fecha_reserva}","${info.importe_total}"`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="reserva_${id}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// Se exporta la función original como alias para que RESERVA.ROUTES.js pueda usarla
export { createReservaConComprobante as createReserva };
