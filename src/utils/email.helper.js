// src/utils/email.helper.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarNotificacionReserva = async ({ destinatario, asunto, mensaje }) => {
  const mailOptions = {
    from: `"PROGIII Reservas" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html: `<p>${mensaje}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', destinatario);
    console.log('Detalles del envío:', info); 
  } catch (error) {
    console.error('Error al enviar correo:', error);
  }
};
