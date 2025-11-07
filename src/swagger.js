import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// ************************************************************
// DEFINICIÓN BASE DE SWAGGER (OpenAPI 3.0.0)
// ************************************************************
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Reservas Salones de Cumpleaños',
    version: '1.0.0',
    description: 'Documentación del Trabajo Final Integrador - Programación III',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor local con prefijo /api',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',          // Tipo HTTP (JWT)
        scheme: 'bearer',      // Autenticación tipo Bearer
        bearerFormat: 'JWT',   // Formato del token
      },
    },
  },
  // ************************************************************
  // SEGURIDAD GLOBAL (todas las rutas requerirán JWT por defecto)
  // ************************************************************
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// ************************************************************
// OPCIONES: Indica dónde buscar las anotaciones Swagger
// ************************************************************
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // ✅ ruta correcta para Swagger
};


// Genera el objeto final de especificación
const swaggerSpec = swaggerJSDoc(options);

// ************************************************************
// FUNCIÓN PARA INICIALIZAR SWAGGER EN EXPRESS
// ************************************************************
export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
