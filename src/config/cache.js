import apicache from 'apicache';

// Inicializa el objeto de caché de apicache
const cache = apicache.middleware;

// Opciones de configuración por defecto
const defaultOptions = {
    // 5 minutos por defecto, puede ser '10 minutes', '1 hour', etc.
    defaultDuration: '5 minutes', 
    statusCodes: {
        include: [200]
    },
    header: 'X-APICACHE',// esta linea le dice a postman si la solicitud viene del server o de cache
};

/**
 * Función para obtener el middleware de caché que se usa en las rutas GET.
 * @param {string} duration Duración de caché específica (opcional).
 * @param {object} options Opciones de configuración adicionales (opcional).
 * @returns {function} Middleware de apicache configurado.
 */
export const cacheMiddleware = (duration = defaultOptions.defaultDuration, options = {}) => {
    const finalOptions = { ...defaultOptions, ...options };
    return cache(duration, finalOptions);
};

// Exporta el objeto apicache original para funciones de limpieza (.clear(), .getIndex())
export const apicacheInstance = apicache;