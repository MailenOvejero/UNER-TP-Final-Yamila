import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'yamilamailenovejero27@gmail.com',
    pass: 'dealadkwlneqjwwj'
  }
});

transporter.sendMail({
  from: '"Test" <yamilamailenovejero27@gmail.com>',
  to: 'oscram@correo.com',
  subject: 'Prueba SMTP',
  text: 'Este es un correo de prueba desde Node.js'
}).then(() => {
  console.log('✅ Correo enviado correctamente');
}).catch((err) => {
  console.error('❌ Error al enviar:', err);
});
