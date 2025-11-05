import { Parser } from 'json2csv';
import fs from 'fs';


//funcion para generar csv 
export const generarCSVReservas = (reservas, path) => {
  const fields = [
    'reserva_id',
    'cliente',
    'salon',
    'turno',
    'fecha_reserva',
    'tematica',
    'importe_total'
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(reservas);

  fs.writeFileSync(path, csv);
};
