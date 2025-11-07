import nodemailer from "nodemailer";

let transporter;

// Inicializa el transporter según el entorno
export const initTransporter = async () => {
  if (process.env.NODE_ENV === "development") {
    // Modo simulado: no envía correos reales
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(" Modo desarrollo: usando cuenta ficticia Ethereal");
  } else {
    // Modo producción: usa Gmail
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

// Función para enviar notificación de reserva
export const enviarNotificacionReserva = async ({ destinatario, asunto, mensaje }) => {
  const mailOptions = {
    from: `"PROGIII Reservas" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html: `<p>${mensaje}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(` Correo enviado a: ${destinatario}`);
    console.log(" Detalles del envío:", info);

    if (process.env.NODE_ENV === "development") {
      console.log(" Vista del correo:", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error(" Error al enviar correo:", error.message);
  }
};
