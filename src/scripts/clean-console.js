// scripts/clean-console.js

import { platform } from 'os';
import { execSync } from 'child_process';

/**
 * Limpia la consola según el sistema operativo.
 * Lo sumamos a la inicialización del server
 */
function cleanConsole() {
    const osType = platform();

    if (osType === 'win32') {
        // Windows usa 'cls'
        try {
            execSync('cls', { stdio: 'inherit' });
        } catch (e) {
            // Ignorar errores si cls no está disponible
        }
    } else {
        // Linux/macOS/otros usan 'clear'
        try {
            execSync('clear', { stdio: 'inherit' });
        } catch (e) {
            // Ignorar errores si clear no está disponible
        }
    }
}

cleanConsole();