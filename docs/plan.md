🚀 División de Trabajo - Primera Entrega (BREAD API)
📋 Objetivo
Implementar operaciones BREAD (Browse, Read, Edit, Add, Delete) completas para una entidad de la API, incluyendo autenticación, autorización y validación.

👥 División de Trabajo para 2 Personas
Persona 1: Backend Core & Security
Enfoque: Configuración técnica fundamental, autenticación (JWT) y autorización.

✅ Tareas Detalladas:
Configuración Inicial: Inicializar Express, configurar conexión MySQL y variables de entorno (.env).

Middlewares Globales: Implementar morgan, compression, cors y Body Parsers (express.json, express.urlencoded) en el orden correcto.

Autenticación (Login/JWT): Implementar el servicio de usuario (hasheo MD5) y la ruta POST /api/auth/login para generar el JWT.

Middlewares de Autorización: Crear los middlewares verifyToken (verifica JWT, 401) y authorize (control de roles, 403).

Manejo de Errores: Asegurar el errorHandler (500) y el notFound (404) para manejar todos los errores de forma centralizada.

Estructura Modular: Organizar el enrutamiento bajo el prefijo /api (o /api/v1).

Persona 2: Entity BREAD & Calidad Técnica
Enfoque: Implementación completa de la lógica de negocio y las validaciones para la entidad elegida.

✅ Tareas Detalladas:
Selección de Entidad: Elegir la entidad para el BREAD completo (Salones, Servicios o Turnos).

Modelo/Servicio de Entidad: Implementar las 4 operaciones (Crear, Leer, Actualizar, Borrar - Soft Delete) en la capa de servicio, interactuando con MySQL.

Controladores y Rutas: Crear el Controlador y el Router de la entidad, mapeando los verbos HTTP (GET, POST, PUT, DELETE).

Validación de Datos: Instalar e implementar express-validator para validar los campos de entrada en las rutas POST y PUT.

Integración de Seguridad: Aplicar los middlewares verifyToken y authorize de la Persona 1 para proteger las rutas según los roles definidos (Admin, Empleado, Cliente).

Documentación: Documentar todos los endpoints BREAD implementados usando Swagger.

🛠️ Consideraciones Técnicas Clave
Estrategia Git
Usar ramas separadas: feat/auth-jwt (Persona 1) y feat/bread-[entidad] (Persona 2).

Hacer merge solo después de la entrega funcional del Middleware de Autorización por la Persona 1.

Requisitos
Soft Delete obligatorio (usar el campo activo = 0).

Usar JWT para autenticación y Roles para autorización.

Buen manejo de errores (códigos 400, 401, 403, 500).


