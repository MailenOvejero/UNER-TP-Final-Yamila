# API de Sistema de Reservas

Este documento proporciona las instrucciones necesarias para configurar y ejecutar el proyecto de API RESTful para un sistema de gestión de reservas.

**Autores:**
* Yamila Mailen Overjero
* Emanuel Conte Garcia

## Descripción del Proyecto

El proyecto es una API backend desarrollada en Node.js con Express, diseñada para gestionar las operaciones de un negocio de reservas, como salones para eventos. Implementa una arquitectura por capas, un sistema de seguridad robusto basado en roles y tokens JWT, y diversas funcionalidades para la administración de usuarios, salones, servicios y reservas.

## Arquitectura y Estructura del Proyecto

El sistema está construido sobre una arquitectura de servicios moderna y con una clara separación de responsabilidades para facilitar su mantenimiento y escalabilidad.

### Arquitectura por Capas

1.  **Rutas (Routes):** Definen los endpoints de la API (ej. `/api/v1/reservas`). Asocian cada ruta con los middlewares de seguridad y los controladores correspondientes.
2.  **Controladores (Controllers):** Orquestan el flujo de la petición. Reciben la solicitud, validan los datos de entrada, llaman a los servicios de negocio y formulan la respuesta HTTP (éxito o error). No contienen lógica de negocio ni acceso a la base de datos.
3.  **Servicios (Services):** Contienen la lógica de negocio principal de la aplicación. Actúan como intermediarios entre los controladores y la capa de acceso a datos, procesando la información y aplicando las reglas del negocio.
4.  **Datos (Data):** Es la capa de acceso a datos. Contiene la lógica para interactuar directamente con la base de datos MySQL, ejecutando las consultas SQL necesarias (CRUD).

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