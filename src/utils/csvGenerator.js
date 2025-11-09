import { Parser } from 'json2csv';
import fs from 'fs';


//Generamos los CSV con estos campos
export const generarCSVReservas = (reservas, path) => {
  const fields = [
    'reserva_id',
    'cliente',
    'salon',
    'turno',
    'fecha_reserva',
    'importe_total'
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(reservas);

  fs.writeFileSync(path, csv);
};
