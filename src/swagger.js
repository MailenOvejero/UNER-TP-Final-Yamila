// src/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Reservas Salones de Cumpleaños',
    version: '1.0.0',
    description: 'Documentación del Trabajo Final Integrador - Programación III',
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Local' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  // Ahora escanea tanto los archivos de rutas JS como los archivos de documentación YAML
  apis: [
    './src/routes/*.js', 
    './src/docs/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);

// EXPORT CORRECTO PARA ES MODULES
export default options;

// FUNCIÓN PARA MONTAR SWAGGER
export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger UI disponible en: http://localhost:3000/docs');
};