import sharp from 'sharp';
import path from 'path';

/**
 * Genera una imagen de invitación superponiendo texto en una imagen base.
 * @param {string} baseImagePath - Ruta a la imagen subida por el usuario.
 * @param {object} data - Datos de la reserva para la invitación.
 * @param {string} outputPath - Ruta donde se guardará la invitación generada.
 */
export const generarInvitacion = async (baseImagePath, data, outputPath) => {
  try {
    const { nombre, fecha_reserva, hora_desde, hora_hasta, salon, ubicacion } = data;

    const width = 800;
    const height = 600;

    // Contenido SVG para superponer en la imagen
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .title { fill: #fff; font-size: 48px; font-weight: bold; font-family: Arial, sans-serif; }
          .details { fill: #fff; font-size: 32px; font-family: Arial, sans-serif; }
          .shadow {
            filter: drop-shadow(3px 3px 4px #333);
          }
        </style>
        <g class="shadow">
          <text x="50%" y="15%" text-anchor="middle" class="title">¡Estás invitado!</text>
          <text x="50%" y="30%" text-anchor="middle" class="details">A la fiesta de ${nombre}</text>
          <text x="50%" y="45%" text-anchor="middle" class="details">Día: ${fecha_reserva}</text>
          <text x="50%" y="60%" text-anchor="middle" class="details">Hora: ${hora_desde} a ${hora_hasta}</text>
          <text x="50%" y="75%" text-anchor="middle" class="details">Lugar: Salón ${salon}</text>
          <text x="50%" y="90%" text-anchor="middle" class="details">(${ubicacion})</text>
        </g>
      </svg>
    `;

    await sharp(baseImagePath)
      .resize(width, height)
      .composite([{
        input: Buffer.from(svgText),
        gravity: 'center',
      }])
      .toFile(outputPath);

    console.log(`[INVITACIÓN] Invitación generada y guardada en: ${outputPath}`);
  } catch (error) {
    console.error('[INVITACIÓN] Error al generar la imagen de invitación:', error);
    throw error;
  }
};