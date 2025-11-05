import PDFDocument from 'pdfkit';
import fs from 'fs';

// creo función para PDF
export const generarPDFReserva = (reserva, path) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(path);

    doc.pipe(stream);

    doc.fontSize(16).text('Reporte de Reserva', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Cliente: ${reserva.cliente}`);
    doc.text(`Salón: ${reserva.salon}`);
    doc.text(`Turno: ${reserva.turno}`);
    doc.text(`Fecha: ${reserva.fecha_reserva}`);
    doc.text(`Temática: ${reserva.tematica}`);
    doc.text(`Importe total: $${reserva.importe_total}`);
    doc.moveDown();

    doc.text('Servicios:');
    if (Array.isArray(reserva.servicios) && reserva.servicios.length > 0) {
      reserva.servicios.forEach((s) => {
        doc.text(`- ${s.descripcion} ($${s.importe})`);
      });
    } else {
      doc.text('No se registraron servicios para esta reserva.');
    }

    doc.end();

    // Esperar a que el archivo se termine de escribir
    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });
};
