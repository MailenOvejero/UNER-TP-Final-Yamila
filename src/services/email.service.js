import nodemailer from 'nodemailer';
import mjml from 'mjml';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';

/**
 * Configuración del transporter de Nodemailer.
 * Se recomienda usar variables de entorno para las credenciales.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true para puerto 465, false para otros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envía un correo electrónico utilizando una plantilla MJML.
 * @param {string} to - El destinatario del correo.
 * @param {string} subject - El asunto del correo.
 * @param {string} templateName - El nombre del archivo de la plantilla (sin extensión .mjml).
 * @param {object} data - Un objeto con los datos para inyectar en la plantilla.
 */
export const sendEmailWithTemplate = async (to, subject, templateName, data) => {
  try {
    // 1. Construir la ruta absoluta a la plantilla
    const templatePath = path.resolve(process.cwd(), `src/templates/emails/${templateName}.mjml`);

    // 2. Leer el contenido del archivo MJML
    const mjmlTemplate = await fs.readFile(templatePath, 'utf-8');

    // 3. Renderizar la plantilla con EJS para inyectar los datos dinámicos
    const mjmlWithData = ejs.render(mjmlTemplate, data);

    // 4. Compilar el MJML a HTML responsive
    const { html } = mjml(mjmlWithData);

    // 5. Configurar las opciones del correo
    const mailOptions = {
      from: `"Tu App de Reservas" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html, // Usamos el HTML generado
    };

    // 6. Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Correo enviado a ${to} usando la plantilla ${templateName}.`);
  } catch (error) {
    console.error(`[EMAIL SERVICE] Error al enviar correo con plantilla a ${to}:`, error);
    throw new Error('No se pudo enviar el correo electrónico.');
  }
};