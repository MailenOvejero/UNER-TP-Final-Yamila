import cron from 'node-cron';
import { getDbPool } from '../config/db.js';
import { enviarNotificacionReserva } from '../utils/email.helper.js';

export function iniciarJobEncuestas() {
  console.log('⏰ Tarea cron de encuestas iniciada');
  // cron programa la tarea
  cron.schedule('0 9 * * *', async () => {
    try {
      const pool = getDbPool();

      const [reservas] = await pool.query(`
        SELECT r.reserva_id, u.nombre, u.apellido, u.nombre_usuario AS email
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.usuario_id
        WHERE r.fecha_reserva < CURDATE()
          AND r.reserva_id NOT IN (SELECT reserva_id FROM encuestas)
      `);

      for (const r of reservas) {
        const link = `http://localhost:5173/encuesta/${r.reserva_id}`;
        await enviarNotificacionReserva({
          destinatario: r.email,
          asunto: 'Tu opinión nos importa ',
          mensaje: `
            Hola ${r.nombre} ${r.apellido},<br><br>
            Esperamos que hayas disfrutado tu experiencia.<br>
            Te invitamos a completar la encuesta de satisfacción:<br>
            <a href="${link}">${link}</a><br><br>
            ¡Gracias por elegirnos! 🌟
          `,
        });
      }

      console.log(` Se enviaron ${reservas.length} encuestas pendientes.`);
    } catch (error) {
      console.error(' Fallo en la tarea de encuestas:', error);
    }
  });
}
