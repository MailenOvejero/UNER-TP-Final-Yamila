Informe de Arquitectura y Funcionalidad del Proyecto: API de Sistema de Reservas
Este documento describe la arquitectura, tecnologías, características y estructura de un proyecto de API RESTful desarrollado en Node.js con Express. El objetivo es servir como sistema de gestión para un negocio de reservas, posiblemente de salones para eventos.

1. Resumen del Proyecto
El proyecto es una API backend diseñada para gestionar entidades como usuarios, salones, servicios, turnos y reservas. Implementa un sistema robusto de autenticación y autorización basado en roles, sigue una arquitectura modular y por capas, e incluye funcionalidades avanzadas como generación de reportes, notificaciones por correo y caché de API.

2. Arquitectura y Tecnologías
El sistema está construido sobre una arquitectura de servicios moderna y bien definida.

Tecnologías Principales:

Backend: Node.js con el framework Express.js.
Base de Datos: MySQL.
Autenticación: Tokens web JSON (JWT).
Validación: express-validator para la validación de datos de entrada.
Caché: apicache para optimizar el rendimiento de las rutas GET.
Estructura Arquitectónica (API by Design): El proyecto sigue una arquitectura por capas con una clara separación de responsabilidades:

Rutas (routes): Definen los endpoints de la API y los asocian con los middlewares y controladores correspondientes. El enrutador principal se encuentra en src/routes/index.js y agrupa las rutas de cada entidad (usuarios, salones, reservas, etc.).
Controladores (controllers): Orquestan el flujo de la petición. Reciben la solicitud, llaman a los servicios de negocio necesarios y formulan la respuesta HTTP. No contienen lógica de base de datos.
Servicios (services): Contienen la lógica de negocio principal. Actúan como intermediarios entre los controladores y la capa de acceso a datos.
Datos (data): Contienen la lógica de acceso a la base de datos, ejecutando las consultas SQL para interactuar con MySQL.
Configuración (config): Centraliza la configuración de la aplicación, como la conexión a la base de datos (db.js), la definición de roles (roles.js) y la instancia de caché (cache.js).
Utilidades (utils): Módulos de ayuda para tareas transversales como generar PDFs (pdfGenerator.js), archivos CSV (csvGenerator.js) y enviar correos (email.helper.js).
3. Flujo de Seguridad: Autenticación y Autorización
La seguridad es un pilar fundamental del proyecto, gestionada a través de un flujo de dos fases.

Fase 1: Autenticación (Login)

Un cliente envía nombre_usuario y password al endpoint POST /api/auth/login.
El auth.controller.js recibe las credenciales.
Llama al usuario.service.js para verificar si el usuario existe y si la contraseña es correcta (usando crypto para el hasheo).
Si las credenciales son válidas, se genera un token JWT que incluye el usuario_id y el tipo_usuario (rol).
El cliente recibe el token y debe almacenarlo para futuras peticiones.
Fase 2: Acceso a Rutas Protegidas

Para acceder a un endpoint protegido (ej. GET /api/v1/salones), el cliente debe incluir el token en el encabezado Authorization como Bearer <token>.
El middleware verifyToken intercepta la petición, decodifica el JWT y, si es válido, adjunta el payload (con el ID y rol del usuario) al objeto req. Si el token es inválido, responde con un error 401 Unauthorized.
A continuación, el middleware authorize se ejecuta. Compara el rol del usuario (req.user.role) con los roles permitidos para esa ruta específica.
Si el usuario no tiene el rol adecuado, el middleware responde con un error 403 Forbidden.
Si ambos middlewares se superan con éxito, la petición llega finalmente al controlador de la entidad para ser procesada.
Roles de Usuario Definidos (src/config/roles.js):

ADMIN (1): Acceso total al sistema.
EMPLEADO (2): Acceso intermedio para gestionar entidades de negocio como salones, servicios y turnos.
CLIENTE (3): Acceso limitado, principalmente para crear y consultar sus propias reservas.
4. Funcionalidades Clave Implementadas
Operaciones BREAD: La API implementa las operaciones BREAD (Browse, Read, Edit, Add, Delete) para las entidades principales. La eliminación es de tipo Soft Delete, marcando los registros como inactivos (activo = 0) en lugar de borrarlos físicamente.
Generación de Reportes:
CSV: Existe un endpoint (generarReporteCSV) que exporta un listado completo de reservas a un archivo .csv.
PDF: Se puede generar un PDF detallado para una reserva específica (generarReportePDF), incluyendo datos del cliente, salón, turno y servicios contratados.
Notificaciones por Correo (email.helper.js):
Al crear una nueva reserva, el sistema envía automáticamente un correo de confirmación al cliente.
Simultáneamente, notifica por correo a todos los usuarios con rol de ADMIN sobre la nueva reserva creada, asegurando que el personal esté siempre informado.
Estadísticas: La API expone un endpoint que consume un procedimiento almacenado en la base de datos (getEstadisticasPorMes) para generar estadísticas, como la cantidad de reservas por mes.
Manejo de Errores Centralizado: El proyecto utiliza middlewares para manejar errores de forma centralizada, incluyendo un manejador para rutas no encontradas (404 Not Found) y un manejador general para errores de servidor (500 Internal Server Error).
Documentación y Planificación: Los documentos en la carpeta docs revelan una planificación estructurada, incluyendo un plan de división de trabajo (plan.md), notas técnicas (notes.md), comandos de Git (git.md) y un esquema para un plan de QA (QA.md).
5. Estructura de Archivos Relevante
plaintext
/src
|-- /config
|   |-- db.js           # Conexión a la base de datos
|   |-- roles.js        # Definición de roles de usuario
|   |-- cache.js        # Configuración de apicache
|-- /controllers
|   |-- auth.controller.js
|   |-- RESERVA.CONTROLLER.js
|   |-- ... (otros controladores)
|-- /data
|   |-- reserva.data.js # Lógica de acceso a datos para reservas
|   |-- ... (otros archivos de datos)
|-- /middlewares
|   |-- auth.middleware.js # verifyToken y authorize
|   |-- ... (otros middlewares)
|-- /routes
|   |-- index.js        # Enrutador principal
|   |-- auth.routes.js
|   |-- RESERVA.ROUTES.js
|   |-- ... (otras rutas)
|-- /services
|   |-- usuario.service.js
|   |-- reserva.service.js
|   |-- ... (otros servicios)
|-- /utils
|   |-- csvGenerator.js
|   |-- pdfGenerator.js
|   |-- email.helper.js
|-- app.js              # Archivo principal de la aplicación Express
/docs
|-- git.md
|-- notes.md
|-- plan.md
|-- QA.md