import bcrypt from 'bcrypt';

const password = '123456';
const saltRounds = 10;

const usuarios = [
  'alblop@correo.com',
  'pamgom@correo.com',
  'estcir@correo.com',
  'oscram@correo.com',
  'clajua@correo.com',
  'wilcor@correo.com',
  'anaflo@correo.com'
];

const generarHashes = async () => {
  for (const email of usuarios) {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`UPDATE usuarios SET password = '${hash}' WHERE nombre_usuario = '${email}';`);
  }
};

generarHashes();
