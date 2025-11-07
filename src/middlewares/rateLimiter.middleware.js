import rateLimit from 'express-rate-limit';

/**
 * Middleware de Rate Limiting para la ruta de login.
 * Limita a 10 intentos de inicio de sesión por IP cada 15 minutos.
 */
export const loginRateLimiter = rateLimit({
  // Ventana de tiempo en milisegundos (15 minutos)
  windowMs: 15 * 60 * 1000,
  
  // Número máximo de peticiones permitidas en la ventana de tiempo
  max: 10,
  
  // Mensaje de error que se enviará cuando se supere el límite
  message: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, intente de nuevo después de 15 minutos.',
  
  // Headers estándar para informar al cliente sobre el límite
  standardHeaders: true, // Devuelve la información del rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*` (legacy)
});