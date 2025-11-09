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
        // --- Para Morgan escribimos en Stream un archivo.log ---
        
        // definimos el Path del log
        const logDirectory = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logDirectory)) {
            // fs.mkdirSync es síncrono, aceptable al inicio del servidor
            fs.mkdirSync(logDirectory);
        }

        // los logs van como archivo srteam, lo creamos
        const accessLogStream = fs.createWriteStream(
            path.join(logDirectory, 'access.log'), 
            { flags: 'a' } // 'a' flag para continuar excribiendo desde elo ultimo
        );

        console.log(chalk.yellow('Morgan: Configurado para escribir logs en: logs/access.log'));
        return morgan('combined', { stream: accessLogStream });

    } else {
        // --- para dev Morgan escribie en consola ---
        console.log(chalk.yellow('Morgan: Configurado para logs en consola (dev).'));
        return morgan('dev');
    }
}