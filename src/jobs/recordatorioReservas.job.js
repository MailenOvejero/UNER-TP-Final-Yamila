// src/jobs/recordatorioReservas.job.js
import cron from "node-cron";
import { getDbPool } from "../config/db.js";
import { enviarNotificacionReserva } from "../utils/email.helper.js";
import chalk from "chalk";

/**
 * este diario que enviia recordatorios 24hs antes de la reserva
 * y notifica a los administradores activos de todas las reservas que hay para mañana 
 * Se ejecutauna sola vez, todos los días a las 09:00 AM
 */
export const iniciarJobRecordatorios = () => {
    console.log(chalk.blue.bold(" Job de recordatorios de reservas ACTIVADO (09:00AM diario)"));

    // el formato es CRON : "minuto hora * * *" (9:00 AM todos los días)
    //cron.schedule("0 9 * * *",de esta forma, se ejecutaria todos los dias a las 9am, pero
    // voy a cambiarlo por cron.schedule("* * * * *", para poder probar que funcione yaq asi, se ejecute cada minuto
   // UPDATE reservas SET fecha_reserva = DATE_ADD(CURDATE(), INTERVAL 1 DAY) WHERE reserva_id = 1;


        cron.schedule("0 9 * * *", async () => {
        console.log(chalk.yellow("Ejecutando job de recordatorios de reservas..."));
        const pool = getDbPool();

        try {
            //  Buscamos las reservas para mañana
            const [reservas] = await pool.query(`
        SELECT 
          r.reserva_id,
          r.fecha_reserva,
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
        WHERE DATE(r.fecha_reserva) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
          AND r.activo = 1
      `);

            if (reservas.length === 0) {
                console.log(chalk.gray("No hay reservas para mañana."));
                return;
            }

            console.log(chalk.green(`Se encontraron ${reservas.length} reservas para mañana.`));

            // Enviamos recordatorio individual a cada cliente
            for (const r of reservas) {
                const mensaje = `
          Hola ${r.nombre} ${r.apellido},<br><br>
          Te recordamos que tenés una reserva mañana (${r.fecha_reserva}) en el salón <b>${r.salon}</b>.<br>
          Turno: ${r.hora_desde} a ${r.hora_hasta}<br><br>
          ¡Te esperamos! 
        `;

                try {
                    await enviarNotificacionReserva({
                        destinatario: r.email,
                        asunto: "Recordatorio de tu reserva",
                        mensaje,
                    });
                    console.log(chalk.green(`Recordatorio enviado a ${r.email}`));
                } catch (err) {
                    console.error(chalk.red(` Error enviando recordatorio a ${r.email}: ${err.message}`));
                }
            }

            // Enviar resumen diario a los administradores activos
            const [admins] = await pool.query(`
        SELECT nombre_usuario AS email
        FROM usuarios
        WHERE tipo_usuario = 1 AND activo = 1
      `);

            if (admins.length > 0) {
                // Construir resumen en HTML
                let resumen = `
          <h2>Reservas programadas para mañana (${reservas[0].fecha_reserva})</h2>
          <ul>
        `;
                for (const r of reservas) {
                    resumen += `
            <li>
              <b>${r.nombre} ${r.apellido}</b> – ${r.salon} (${r.hora_desde} a ${r.hora_hasta})
            </li>
          `;
                }
                resumen += "</ul>";

                for (const admin of admins) {
                    try {
                        await enviarNotificacionReserva({
                            destinatario: admin.email,
                            asunto: "Resumen diario de reservas para mañana",
                            mensaje: resumen,
                        });
                        console.log(chalk.green(`Resumen enviado a admin: ${admin.email}`));
                    } catch (mailErr) {
                        console.error(chalk.red(`Error enviando resumen a admin ${admin.email}: ${mailErr.message}`));
                    }
                }
            } else {
                console.log(chalk.gray("No hay administradores activos para notificar."));
            }

        } catch (error) {
            console.error(chalk.red("Error en job de recordatorios:"), error);
        }
    });
};
