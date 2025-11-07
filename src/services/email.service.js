import nodemailer from 'nodemailer';
import mjml from 'mjml';
import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';

// Log de diagnóstico para verificar que las variables estén cargadas
console.log('[EMAIL SERVICE] Configuración SMTP:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '***' : undefined,
});

/**
 * Configuración del transporter de Nodemailer.
 * Se recomienda usar variables de entorno para las credenciales.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // true para puerto 465
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
    const templatePath = path.resolve('src/templates/emails', `${templateName}.mjml`);
    console.log('[EMAIL SERVICE] Ruta de plantilla:', templatePath);

    // 2. Verificar que el archivo exista
    await fs.access(templatePath);

    // 3. Leer el contenido del archivo MJML
    const mjmlTemplate = await fs.readFile(templatePath, 'utf-8');

    // 4. Renderizar la plantilla con EJS
    const mjmlWithData = ejs.render(mjmlTemplate, data);
    console.log('[EMAIL SERVICE] Datos inyectados en plantilla:', data);

    // 5. Compilar MJML a HTML
    const { html } = mjml(mjmlWithData);

    // 6. Configurar opciones del correo
    const mailOptions = {
      from: `"Tu App de Reservas" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // 7. Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Correo enviado a ${to} usando la plantilla ${templateName}.`);
  } catch (error) {
    console.error(`[EMAIL SERVICE] Error al enviar correo con plantilla a ${to}:`, error);
    throw new Error('No se pudo enviar el correo electrónico.');
  }
};
