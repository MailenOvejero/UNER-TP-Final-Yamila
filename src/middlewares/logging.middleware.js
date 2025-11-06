import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Configura y devuelve el middleware de Morgan basado en el entorno.
 * En producción, registra en un archivo 'access.log'.
 * En desarrollo, registra en la consola.
 * * @param {string} env El entorno actual (development, production, etc.)
 * @returns {function} El middleware de Morgan configurado.
 */
export function setupLogging(env) {
    if (env === 'production') {
        // --- Lógica para producción (escribir en archivo) ---
        
        // 1. Definir y asegurar el directorio de logs
        const logDirectory = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logDirectory)) {
            // fs.mkdirSync es síncrono, aceptable al inicio del servidor
            fs.mkdirSync(logDirectory);
        }

        // 2. Crear el stream de escritura
        const accessLogStream = fs.createWriteStream(
            path.join(logDirectory, 'access.log'), 
            { flags: 'a' } // 'a' para agregar al final del archivo
        );

        // 3. Devolver Morgan configurado para archivo
        console.log(chalk.yellow('Morgan: Configurado para escribir logs en: logs/access.log'));
        return morgan('combined', { stream: accessLogStream });

    } else {
        // --- Lógica para desarrollo (escribir en consola) ---
        console.log(chalk.yellow('Morgan: Configurado para logs en consola (dev).'));
        return morgan('dev');
    }
}