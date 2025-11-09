# API de Sistema de Reservas para Eventos

Este documento proporciona una guía completa para configurar, ejecutar y entender el proyecto de API RESTful para un sistema avanzado de gestión de reservas.

**Autores:**
* Yamila Mailen Overjero
* Emanuel Conte Garcia

## Descripción del Proyecto

El proyecto es una API backend robusta y escalable, desarrollada en **Node.js con Express**, diseñada para gestionar integralmente las operaciones de un negocio de reservas de salones para eventos. La API no solo cubre las operaciones CRUD básicas, sino que también implementa una arquitectura por capas, un sistema de seguridad avanzado con migración de hashes, y un amplio abanico de funcionalidades que automatizan y mejoran la gestión del negocio y la experiencia del cliente.

## Funcionalidades Extra y Mejoras Técnicas

Además de las operaciones estándar, la API incorpora una serie de características avanzadas para mejorar la seguridad, la experiencia de usuario y la mantenibilidad.


### Cliente neuevo CREA USUARIO EN RUTA PUBLICA (/api/auth/register/client)
    Esta habilitado el endpoint para que se puede crear un usuario nuevo.

### Seguridad y Autenticación
*   **Migración de Hashes a `bcrypt`:** El sistema detecta automáticamente contraseñas hasheadas con el antiguo algoritmo MD5. Si la validación de un usuario es exitosa, su contraseña se migra de forma transparente al nuevo y más seguro formato `bcrypt`.
*   **Notificación de Errores a Administradores:** Ante un error crítico no controlado (código 500), el sistema notifica automáticamente por correo electrónico a todos los administradores para una respuesta inmediata.

### Gestión de Reservas y Clientes
*   **Creación de Reservas con Comprobante:** Al crear una reserva, el cliente debe adjuntar un comprobante de pago, el cual es gestionado eficientemente con **Multer**.
*   **Registro Público de Clientes:** Se expone una ruta pública (`/api/auth/register/client`) que permite a cualquier persona registrarse como cliente en el sistema.
*   **Gestión de Invitados:** El cliente puede agregar, listar, editar y eliminar invitados asociados a su reserva.
*   **Reporte CSV por Reserva:** Se implementó un endpoint para descargar el reporte en formato CSV de una única reserva específica por su ID.

### Automatización y Comunicación
*   **Sistema de Encuestas de Satisfacción:**
    *   24 horas después de un evento, se envía automáticamente una encuesta de satisfacción al correo del cliente.
    *   Cuando un cliente responde, se notifica por correo a los administradores.
    *   Los administradores pueden listar todas las encuestas del sistema o filtrarlas por reserva.
*   **Sistema de Comentarios por Reserva:**
    *   Los administradores pueden agregar comentarios a una reserva (ej: "Recibí el comprobante de pago").
    *   El cliente recibe una notificación por correo con el nuevo comentario.
    *   Se pueden listar todos los comentarios de una reserva o del sistema completo.
*   **Recordatorios de Reservas:** Un `job` programado se ejecuta diariamente para enviar recordatorios por correo a los clientes 24 horas antes de su evento y un resumen a los administradores con las reservas del día siguiente.

### Desarrollo y Debugging
*   **Logging Avanzado:**
    *   En producción, **Morgan** guarda los logs en el archivo `stream.log`.
    *   En desarrollo, se utiliza **Chalk** para colorear los logs en la consola, mejorando drásticamente la legibilidad.
*   **Entornos Separados:** Se implementaron dos archivos `.env` (`.env.development` y `.env.production`) con valores de prueba para todas las funcionalidades, facilitando la configuración.
*   **Arranque Seguro del Servidor:** La función `startServer` en `app.js` verifica que la conexión a la base de datos sea exitosa antes de levantar el servidor, evitando inconsistencias.
*   **Simulación de Correos:** Se utiliza **Ethereal** en desarrollo para capturar y visualizar correos sin necesidad de configurar un servidor SMTP, agilizando las pruebas.
*   **Listado de Rutas en Modo Debug:** Una función de depuración permite imprimir en consola todas las rutas registradas en la aplicación.
*   **Script de Limpieza:** Se incluye un script `npm run clean` para limpiar la consola de manera multi-plataforma.

### Rutas Públicas y de Testeo
*   **Ruta de Bienvenida:** `GET /` (pública).
*   **Ruta de Test de Correo:** `GET /api/auth/test-email` (protegida) para verificar la configuración de envío de correos.

## Arquitectura y Estructura del Proyecto

El sistema está construido sobre una arquitectura de servicios moderna y con una clara separación de responsabilidades para facilitar su mantenimiento y escalabilidad.

### Arquitectura por Capas

1.  **Rutas (Routes):** Definen los endpoints de la API (ej. `/api/v1/reservas`). Asocian cada ruta con sus middlewares de seguridad, validación y controladores.
2.  **Controladores (Controllers):** Orquestan el flujo de la petición. Reciben la solicitud, validan los datos de entrada (`express-validator`), llaman a los servicios de negocio y formulan la respuesta HTTP. No contienen lógica de negocio ni acceso directo a la base de datos.
3.  **Servicios (Services):** Contienen la lógica de negocio principal. Actúan como intermediarios entre los controladores y la capa de datos, aplicando reglas y procesando la información.
4.  **Datos (Data):** Capa de acceso a datos. Contiene la lógica para interactuar directamente con la base de datos MySQL, ejecutando consultas SQL (CRUD) y procedimientos almacenados.
5.  **Jobs (Tareas Programadas):** Módulos independientes que ejecutan tareas recurrentes (ej. envío de recordatorios) utilizando `node-cron`.

### Estructura de Archivos

```
/
|-- /docs
|   |-- README.md
|-- /src
|   |-- /config
|   |   |-- db.js           # Conexión a la base de datos
|   |   |-- roles.js        # Definición de roles de usuario
|   |   |-- cache.js        # Configuración de apicache
|   |-- /controllers
|   |   |-- auth.controller.js
|   |   |-- reserva.controller.js
|   |-- /data
|   |   |-- reserva.data.js
|   |-- /middlewares
|   |   |-- auth.middleware.js # Middlewares verifyToken y authorize
|   |   |-- validators.js      # Middlewares de express-validator
|   |-- /routes
|   |   |-- index.js        # Enrutador principal
|   |   |-- auth.routes.js
|   |   |-- reserva.routes.js
|   |-- /services
|   |   |-- usuario.service.js
|   |   |-- reserva.service.js
|   |-- /utils
|   |   |-- csvGenerator.js
|   |   |-- pdfGenerator.js
|   |   |-- email.helper.js
|   |-- app.js              # Archivo principal de la aplicación Express
|-- .env.development        # Variables de entorno para desarrollo
|-- .env.production         # Variables de entorno para producción
|-- package.json
|-- README.md
```

## Funcionalidades Principales

*   **Gestión de Entidades (BREAD):** La API implementa las operaciones BREAD (Browse, Read, Edit, Add, Delete) para las entidades principales del sistema. La eliminación de registros se realiza mediante borrado lógico (Soft Delete).
*   **Autenticación y Autorización por Roles:** Utiliza JSON Web Tokens (JWT) para proteger las rutas. El acceso a los recursos está restringido según tres roles de usuario:
    *   **ADMIN (1):** Acceso total al sistema.
    *   **Registro de Clientes:** Expone un endpoint público (`POST /api/auth/registro/cliente`) que permite a los nuevos usuarios registrarse de forma autónoma con el rol de `CLIENTE`.
    *   **EMPLEADO (2):** Permisos para gestionar entidades de negocio como salones y turnos.
    *   **CLIENTE (3):** Acceso limitado para crear y consultar sus propias reservas.
*   **Generación de Reportes:**
    *   **CSV:** Exporta un listado completo de reservas en formato `.csv`.
    *   **PDF:** Genera un comprobante detallado en formato `.pdf` para una reserva específica.
*   **Notificaciones por Correo:** El sistema envía correos electrónicos automáticamente en eventos clave, como la confirmación de una nueva reserva al cliente y la notificación de la misma a los administradores.
*   **Estadísticas:** Proporciona un endpoint para obtener estadísticas, como la cantidad de reservas agrupadas por mes.
*   **Caché de API:** Utiliza `apicache` para cachear las respuestas de las rutas GET, mejorando el rendimiento y reduciendo la carga sobre la base de datos.
*   **Manejo de Errores Centralizado:** Implementa middlewares para gestionar de forma consistente los errores 404 (Ruta No Encontrada) y 500 (Error Interno del Servidor).
*   **Validación de Datos:** Usa `express-validator` para validar y sanitizar los datos de entrada en las rutas que crean o actualizan recursos, asegurando la integridad de la información.

## 1. Requerimientos

### Software
*   **Node.js:** Versión 18 o superior.
*   **NPM:** Gestor de paquetes de Node.js.
*   **MySQL:** Servidor de base de datos.

### Módulos y Dependencias

#### Producción (`dependencies`)
*   `express`: Framework web para Node.js.
*   `mysql2`: Cliente de MySQL para Node.js, con soporte para Promises.
*   `dotenv`: Carga variables de entorno desde archivos `.env`.
*   `jsonwebtoken`: Para la generación y verificación de tokens JWT.
*   `cors`: Middleware para habilitar Cross-Origin Resource Sharing.
*   `helmet`: Ayuda a securizar la aplicación estableciendo diversas cabeceras HTTP.
*   `compression`: Middleware para comprimir las respuestas HTTP.
*   `morgan`: Logger de peticiones HTTP.
*   `express-validator`: Herramientas para la validación y sanitización de datos.
*   `apicache`: Middleware para cachear respuestas de la API.
*   `nodemailer`: Módulo para el envío de correos electrónicos.
*   `jspdf`: Para la generación de documentos PDF en el lado del servidor.
*   `jspdf-autotable`: Plugin para jspdf que facilita la creación de tablas.

#### Desarrollo y Debugging (`devDependencies`)
*   `nodemon`: Monitorea cambios en los archivos y reinicia el servidor automáticamente, ideal para el desarrollo.
*   `eslint`: Analiza el código para encontrar y corregir problemas de estilo y errores potenciales.
*   `chalk`: Permite colorear el texto en la consola, usado para mejorar la legibilidad de los logs.

## 2. Configuración de la Base de Datos

Por razones de seguridad, es fundamental **no utilizar el usuario `root` de MySQL** para la aplicación. Se debe crear un usuario dedicado con permisos específicos sobre la base de datos del proyecto.

**Pasos:**

1.  Conéctate a tu cliente de MySQL como usuario `root`.
2.  Crea la base de datos para el proyecto:

    ```sql
    CREATE DATABASE nombre_de_tu_bd;
    ```

3.  Crea un nuevo usuario y asígnale una contraseña segura:

    ```sql
    CREATE USER 'nombre_usuario'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
    ```

4.  Otorga todos los privilegios necesarios al nuevo usuario sobre la base de datos que creaste:

    ```sql
    GRANT ALL PRIVILEGES ON nombre_de_tu_bd.* TO 'nombre_usuario'@'localhost';
    ```

5.  Aplica los cambios:

    ```sql
    FLUSH PRIVILEGES;
    ```

Ahora puedes usar `nombre_de_tu_bd`, `nombre_usuario` y `tu_contraseña_segura` en los archivos de configuración del entorno.

## 3. Configuración del Entorno

El proyecto utiliza dos archivos de entorno diferentes para separar la configuración de desarrollo y producción, lo cual es una práctica recomendada para evitar conflictos y mejorar la seguridad.

*   `.env.development`: Para el entorno de desarrollo local.
*   `.env.production`: Para el entorno de producción.

El script de inicio de la aplicación cargará uno u otro archivo dependiendo del valor de la variable de entorno `NODE_ENV`.

**Paso a seguir:**

Crea los dos archivos en la raíz del proyecto (`.env.development` y `.env.production`) y complétalos con la configuración correspondiente.

**Ejemplo de plantilla para `.env.development`:**

```env
# Configuración del Servidor
NODE_ENV=development
HOST=127.0.0.1
PORT=3000

# Configuración de la Base de Datos (con el usuario que no es root)
DB_HOST=localhost
DB_USER=nombre_usuario_dev
DB_PASSWORD=contraseña_dev
DB_NAME=nombre_de_bd_dev

# Configuración de Seguridad (JWT)
JWT_SECRET=un_secreto_muy_largo_y_dificil_para_desarrollo
JWT_EXPIRES_IN=1h

# Configuración de Email (ejemplo con Mailtrap para desarrollo)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=usuario_mailtrap
EMAIL_PASS=pass_mailtrap
```

### Funcionalidad Dependiente del Entorno

Algunos módulos están configurados para comportarse de manera diferente según el entorno:

*   **Morgan (Logging):** En `development`, utiliza el formato `'dev'`, que proporciona logs detallados y coloreados, ideales para depurar. En `production`, se puede configurar para usar un formato más conciso como `'combined'` o `'short'`, que registra la información esencial sin sobrecargar los logs del servidor.
*   **CORS:** La configuración de CORS puede ser más permisiva en desarrollo para facilitar las pruebas desde diferentes orígenes, mientras que en producción debe restringirse a los dominios autorizados.

## 4. Instalación y Ejecución

1.  Clona el repositorio.
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```
3.  **Para ejecutar en modo desarrollo:**
    Este comando establece `NODE_ENV=development` y utiliza `nodemon` para reiniciar el servidor automáticamente tras cada cambio.
    ```bash
    npm run dev
    ```
4.  **Para ejecutar en modo producción:**
    Este comando establece `NODE_ENV=production` y ejecuta la aplicación con `node`.
    ```bash
    npm run start
    ```

El servidor se iniciará en el host y puerto especificados en el archivo `.env` correspondiente.

## Licencia

Este proyecto se distribuye bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.