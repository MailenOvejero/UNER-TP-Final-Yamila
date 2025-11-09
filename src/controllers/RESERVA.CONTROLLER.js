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

// ojo, ---- > FUNCIÓN MODIFICADA PARA MANEJAR COMPROBANTES DE PAGO
const createReservaConComprobante = async (req, res, next) => {
  try {
    // manejo del archivo subido por Multer
    const rutaComprobante = req.file ? req.file.path : null;

    // validación, el comprobante debe ser obligatorio
    if (!rutaComprobante) {
      return res.status(400).json({ error: 'El comprobante de pago es obligatorio.' });
    }

    // parseo de datos de texto, porque en multipart/form-data, todos los campos llegan como string.
    const datosReserva = {
      ...req.body,
      servicios: req.body.servicios ? JSON.parse(req.body.servicios) : [],
      importe_salon: req.body.importe_salon ? Number(req.body.importe_salon) : 0,
      ruta_comprobante: rutaComprobante,
    };
    
    // creo la reserva
    const nuevaReserva = await reservaService.crearReserva(datosReserva);

    const { reserva_id } = nuevaReserva;

    const pool = getDbPool();

    // obtengo datos completos de la reserva
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

    // personalizo el mensaje
    const mensaje = `
      Hola ${reserva.nombre} ${reserva.apellido},<br><br>
      Tu reserva fue confirmada para el día ${reserva.fecha_reserva} en el salón "${reserva.salon}".<br>
      Turno: ${reserva.hora_desde} a ${reserva.hora_hasta}<br>
      Temática: ${reserva.tematica || 'Sin temática'}<br>
      Importe total: $${reserva.importe_total}<br>
      ¡Comprobante de pago subido con éxito!<br><br>
      Gracias por confiar en nosotros 🎉
    `;

    // notifico
    await enviarNotificacionReserva({
      destinatario: reserva.email,
      asunto: 'Confirmación de reserva',
      mensaje,
    });

    // ----  a TODOS los adminis activos ----
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

    apicacheInstance.clear();
    res.status(201).json(nuevaReserva);
  } catch (error) {
    next(error);
  }
};

//  actualizar reserva
export const updateReserva = async (req, res, next) => {
  try {
    const actualizada = await reservaService.actualizarReserva(req.params.id, req.body);
    apicacheInstance.clear();
    res.status(200).json(actualizada);
  } catch (error) {
    next(error);
  }
};
// (softdelete)
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

    // get cliente
    const [[cliente]] = await pool.query(`
      SELECT CONCAT(nombre, ' ', apellido) AS cliente
      FROM usuarios
      WHERE usuario_id = ?
    `, [reserva.usuario_id]);

    // get salón
    const [[salon]] = await pool.query(`
      SELECT titulo FROM salones WHERE salon_id = ?
    `, [reserva.salon_id]);

    // get turno
    const [[turno]] = await pool.query(`
      SELECT hora_desde, hora_hasta FROM turnos WHERE turno_id = ?
    `, [reserva.turno_id]);

    // get servicios
    const [servicios] = await pool.query(`
      SELECT s.descripcion, rs.importe
      FROM reservas_servicios rs
      JOIN servicios s ON rs.servicio_id = s.servicio_id
      WHERE rs.reserva_id = ?
    `, [reserva_id]);

    // armao el objeto completo para el PDF
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

// 📦ENDPOINTS PROF PARA DESCARGAR CSV

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

// ------ COMENTARIOS ---------
export const agregarComentario = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const usuario_id = req.user.id; // viene del verifyToken
    const { comentario } = req.body;

    if (!comentario || comentario.trim() === '') {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    const nuevo = await reservaService.agregarComentario({ reserva_id, usuario_id, comentario });
    // limpiar cache si corresponde
    apicacheInstance.clear();
    res.status(201).json({ message: 'Comentario agregado', comentario_id: nuevo.comentario_id });
  } catch (error) {
    next(error);
  }
};

export const listarComentarios = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const comentarios = await reservaService.listarComentarios(reserva_id);
    res.status(200).json(comentarios);
  } catch (error) {
    next(error);
  }
};

// -------- ENCUESTAS -------
export const agregarEncuesta = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const usuario_id = req.user.id;
    const { puntuacion, comentarios } = req.body;

    const nueva = await reservaService.agregarEncuesta({ reserva_id, usuario_id, puntuacion, comentarios });
    apicacheInstance.clear();
    res.status(201).json({ message: 'Encuesta guardada', encuesta_id: nueva.encuesta_id });
  } catch (error) {
    next(error);
  }
};

export const listarEncuestas = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const encuestas = await reservaService.listarEncuestas(reserva_id);
    res.status(200).json(encuestas);
  } catch (error) {
    next(error);
  }
};
// ------- NUEVAS FUNCIONES MEJORADAS -------

// ✅ Listar TODAS las encuestas (para admin o empleado)
export const listarTodasEncuestas = async (req, res, next) => {
  try {
    const pool = getDbPool();
    const [encuestas] = await pool.query(`
      SELECT e.encuesta_id, e.reserva_id, e.usuario_id, e.puntuacion, e.comentarios, e.creado,
             u.nombre, u.apellido
      FROM encuestas e
      JOIN usuarios u ON e.usuario_id = u.usuario_id
      ORDER BY e.creado DESC
    `);

    if (encuestas.length === 0) {
      return res.status(404).json({ message: 'No hay encuestas registradas.' });
    }

    res.status(200).json(encuestas);
  } catch (error) {
    next(error);
  }
};

// Listar TODOS los comentarios (para admin o empleado)
export const listarTodosComentarios = async (req, res, next) => {
  try {
    const pool = getDbPool();
    const [comentarios] = await pool.query(`
      SELECT c.comentario_id, c.reserva_id, c.usuario_id, c.comentario, c.creado,
             u.nombre, u.apellido
      FROM comentarios c
      JOIN usuarios u ON c.usuario_id = u.usuario_id
      ORDER BY c.creado DESC
    `);

    if (comentarios.length === 0) {
      return res.status(404).json({ message: 'No hay comentarios registrados.' });
    }

    res.status(200).json(comentarios);
  } catch (error) {
    next(error);
  }
};

// Notificación automática cuando el admin deja un coment
export const agregarComentarioConNotificacion = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const usuario_id = req.user.id;
    const { comentario } = req.body;

    if (!comentario || comentario.trim() === '') {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    const nuevo = await reservaService.agregarComentario({ reserva_id, usuario_id, comentario });
    const pool = getDbPool();

    // get mail del cliente
    const [[cliente]] = await pool.query(`
      SELECT u.nombre, u.apellido, u.nombre_usuario AS email
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE r.reserva_id = ?
    `, [reserva_id]);

    if (cliente) {
      await enviarNotificacionReserva({
        destinatario: cliente.email,
        asunto: 'Nuevo comentario sobre tu reserva',
        mensaje: `
          Hola ${cliente.nombre} ${cliente.apellido},<br><br>
          El administrador dejó un nuevo comentario en tu reserva:<br>
          <blockquote>${comentario}</blockquote><br>
          ¡Gracias por confiar en nosotros! 💚
        `,
      });
    }

    apicacheInstance.clear();
    res.status(201).json({ message: 'Comentario agregado y correo enviado', comentario_id: nuevo.comentario_id });
  } catch (error) {
    next(error);
  }
};

// Notificación automática cuando el cliente completa la encuesta
export const agregarEncuestaConNotificacion = async (req, res, next) => {
  try {
    const reserva_id = req.params.id;
    const usuario_id = req.user.id;
    const { puntuacion, comentarios } = req.body;

    const nueva = await reservaService.agregarEncuesta({ reserva_id, usuario_id, puntuacion, comentarios });
    const pool = getDbPool();

    // Buscar correo del admin (rol 1)
    const [admins] = await pool.query(`
      SELECT nombre_usuario AS email
      FROM usuarios
      WHERE tipo_usuario = 1 AND activo = 1
    `);

    for (const admin of admins) {
      await enviarNotificacionReserva({
        destinatario: admin.email,
        asunto: 'Nueva encuesta de satisfacción recibida',
        mensaje: `
          <h3>📋 Nueva encuesta completada</h3>
          <p><strong>Reserva ID:</strong> ${reserva_id}</p>
          <p><strong>Puntuación:</strong> ${puntuacion}/5</p>
          <p><strong>Comentarios:</strong> ${comentarios}</p>
        `,
      });
    }

    apicacheInstance.clear();
    res.status(201).json({ message: 'Encuesta guardada y notificación enviada', encuesta_id: nueva.encuesta_id });
  } catch (error) {
    next(error);
  }
};

// Funciones "service" integradas 
const agregarInvitadoDB = async ({ reserva_id, nombre, apellido, edad, email }) => {
  const pool = getDbPool();
  const [result] = await pool.query(
    `INSERT INTO invitados (reserva_id, nombre, apellido, edad, email) VALUES (?, ?, ?, ?, ?)`,
    [reserva_id, nombre, apellido, edad || null, email || null]
  );
  return { invitado_id: result.insertId, reserva_id, nombre, apellido, edad, email };
};

const listarInvitadosDB = async (reserva_id) => {
  const pool = getDbPool();
  const [rows] = await pool.query(
    `SELECT * FROM invitados WHERE reserva_id = ? AND activo = 1`,
    [reserva_id]
  );
  return rows;
};

const actualizarInvitadoDB = async (invitado_id, data) => {
  const pool = getDbPool();
  const { nombre, apellido, edad, email } = data;
  await pool.query(
    `UPDATE invitados SET nombre=?, apellido=?, edad=?, email=?, modificado=NOW() WHERE invitado_id=?`,
    [nombre, apellido, edad || null, email || null, invitado_id]
  );
  return { invitado_id, ...data };
};

const eliminarInvitadoDB = async (invitado_id) => {
  const pool = getDbPool();
  await pool.query(
    `UPDATE invitados SET activo=0, modificado=NOW() WHERE invitado_id=?`,
    [invitado_id]
  );
  return { invitado_id, message: 'Invitado eliminado (soft delete)' };
};


// Agregar uno o varios invitados a una reserva
export const agregarInvitados = async (req, res, next) => {
  try {
    const { reserva_id } = req.params;
    const usuario_id = req.user.id;
    const pool = getDbPool();


    // Verifico => la reserva exista + pertenezca al usuario logueado
    const [reservaRows] = await pool.query(
      `SELECT reserva_id FROM reservas WHERE reserva_id = ? AND usuario_id = ? AND activo = 1`,
      [reserva_id, usuario_id]
    );

    if (!reservaRows || reservaRows.length === 0) {
      return res.status(404).json({ message: 'Reserva no encontrada o no tienes permiso para agregar invitados.' });
    }
 
    let invitados = req.body; // Puede ser un objeto o un array de invitados

    if (!Array.isArray(invitados)) invitados = [invitados];

    const resultados = [];
    for (const invitado of invitados) {
      if (!invitado.nombre || !invitado.apellido) {
        return res.status(400).json({ message: 'Nombre y apellido son obligatorios' });
      }
      const nuevo = await agregarInvitadoDB({ reserva_id, ...invitado });
      resultados.push(nuevo);
    }

    res.status(201).json({ message: 'Invitados agregados', invitados: resultados });
  } catch (error) {
    next(error);
  }
};

// listar invitados en una reserva
export const listarInvitadosReserva = async (req, res, next) => {
  try {
    const { reserva_id } = req.params;
    const usuario_id = req.user.id;
    const userRole = req.user.role;
    const pool = getDbPool();

    // Si el usuario no es Admin/Empleado, verifico que sea el dueño de la reserva
    if (userRole !== 1 && userRole !== 2) { // Asumo 1=ADMIN, 2=EMPLEADO
      const [reservaRows] = await pool.query(
        `SELECT reserva_id FROM reservas WHERE reserva_id = ? AND usuario_id = ? AND activo = 1`,
        [reserva_id, usuario_id]
      );
      if (!reservaRows || reservaRows.length === 0) {
        return res.status(404).json({ message: 'Reserva no encontrada o no tienes permiso para ver los invitados.' });
      }
    }

    const invitados = await listarInvitadosDB(reserva_id);
    res.status(200).json(invitados);
  } catch (error) {
    next(error);
  }
};

//Actualizo datds de invitado
export const actualizarInvitado = async (req, res, next) => {
  try {
    const { reserva_id, invitado_id } = req.params;
    const pool = getDbPool();

    // Verificao que el invitado exista y pertenezca al cliente logueado
    const [rows] = await pool.query(`
      SELECT i.invitado_id
      FROM invitados i
      JOIN reservas r ON i.reserva_id = r.reserva_id AND r.reserva_id = ?
      WHERE i.invitado_id = ? AND r.usuario_id = ? AND i.activo = 1
    `, [reserva_id, invitado_id, req.user.id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Invitado no encontrado o no tenés permiso.' });
    }

    // Validar que nombre y apellido estén presentes
    const { nombre, apellido, edad, email } = req.body;
    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Nombre y apellido son obligatorios.' });
    }

    // Hacer la actualización
    await pool.query(`
      UPDATE invitados
      SET nombre = ?, apellido = ?, edad = ?, email = ?, modificado = NOW()
      WHERE invitado_id = ?
    `, [nombre, apellido, edad || null, email || null, invitado_id]);

    res.status(200).json({
      message: 'Invitado actualizado correctamente',
      invitado: { invitado_id: invitado_id, nombre, apellido, edad, email }
    });

  } catch (error) {
    next(error);
  }
};


// (softDelete)
export const eliminarInvitado = async (req, res, next) => {
  try {
    const { reserva_id, invitado_id } = req.params;
    const pool = getDbPool();

    // Verifico que el invitado exista y pertenezca al cliente logueado
    const [rows] = await pool.query(`
      SELECT i.invitado_id
      FROM invitados i
      JOIN reservas r ON i.reserva_id = r.reserva_id AND r.reserva_id = ?
      WHERE i.invitado_id = ? AND r.usuario_id = ? AND i.activo = 1
    `, [reserva_id, invitado_id, req.user.id]);

    if (!rows || rows.length === 0) {
      // Ojo, si el SELECT no encuentra nada, no se puede borrar
      return res.status(404).json({ message: 'Invitado no encontrado o no tenés permiso.' });
    }

    // Hacer soft delete
    await pool.query(`
      UPDATE invitados
      SET activo = 0, modificado = NOW()
      WHERE invitado_id = ?
    `, [invitado_id]);

    res.status(200).json({ message: 'Invitado eliminado correctamente', invitado_id: invitado_id });

  } catch (error) {
    next(error);
  }
};
