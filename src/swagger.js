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
  {
    url: 'http://localhost:3000/api',
    description: 'Servidor local con prefijo /api',
  },
 ],


  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
 
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],

};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
