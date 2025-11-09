## Packages used:
# Requerimientos de Software y Configuración

### Testing
- Eslint
- Chalk
- nodemon
Este documento detalla el software, las dependencias y la configuración de base de datos necesarios para instalar y ejecutar la API del sistema de reservas.

### Production
- dotenv
- express
- mysql2
- cors
- compresion
- morgan
- jsonwebtoken
- helmet
- express-validator
## 1. Requerimientos del Sistema

*   **Node.js:** Se recomienda la versión **18.x** o superior.
*   **NPM:** Gestor de paquetes de Node.js (generalmente se instala con Node.js).
*   **MySQL:** Servidor de base de datos, versión **8.0** o compatible.

## 2. Configuración de la Base de Datos

Es una práctica de seguridad fundamental **no utilizar el usuario `root` de MySQL** para conectar la aplicación. En su lugar, se debe crear un usuario específico con permisos limitados únicamente a la base de datos del proyecto.

### Pasos para la Creación

1.  Conéctate a tu cliente de MySQL con un usuario que tenga privilegios para crear bases de datos y usuarios (como `root`):

    ```bash
    mysql -u root -p
    ```

2.  Crea la base de datos para la aplicación:

    ```sql
    CREATE DATABASE salon_de_eventos_db;
    ```

3.  Crea un nuevo usuario y asígnale una contraseña segura. Reemplaza `'usuario_app'` y `'contraseña_segura'` con tus propias credenciales:

    ```sql
    CREATE USER 'usuario_app'@'localhost' IDENTIFIED BY 'contraseña_segura';
    ```

4.  Otorga todos los privilegios necesarios al nuevo usuario, pero **únicamente sobre la base de datos que acabas de crear**:

    ```sql
    GRANT ALL PRIVILEGES ON salon_de_eventos_db.* TO 'usuario_app'@'localhost';
    ```

5.  Aplica los cambios para que los privilegios se actualicen en el sistema:

    ```sql
    FLUSH PRIVILEGES;
    ```

6.  Sal del cliente de MySQL:

    ```sql
    EXIT;
    ```

Ahora puedes usar el nombre de la base de datos (`salon_de_eventos_db`), el nuevo usuario (`usuario_app`) y su contraseña en los archivos de configuración `.env` del proyecto.

## 3. Dependencias del Proyecto (package.json)

Para instalar todas las dependencias, ejecuta el siguiente comando en la raíz del proyecto:
```bash
npm install
```

### Dependencias de Producción (`dependencies`)

*   `apicache`: Middleware para cachear respuestas de la API y mejorar el rendimiento.
*   `bcrypt`: Para el hasheo seguro de contraseñas y la migración de hashes MD5.
*   `compression`: Middleware que comprime las respuestas HTTP para reducir el tamaño de la transferencia.
*   `cors`: Habilita el Intercambio de Recursos de Origen Cruzado (CORS).
*   `dotenv`: Carga variables de entorno desde archivos `.env`.
*   `express`: Framework web principal para construir la API.
*   `express-validator`: Para la validación y sanitización de los datos de entrada.
*   `helmet`: Ayuda a securizar la aplicación estableciendo diversas cabeceras HTTP.
*   `jsonwebtoken`: Para la generación y verificación de tokens de autenticación (JWT).
*   `jspdf` y `jspdf-autotable`: Para la generación de reportes en formato PDF.
*   `morgan`: Logger de peticiones HTTP.
*   `multer`: Middleware para manejar la subida de archivos (`multipart/form-data`), como los comprobantes de pago.
*   `mysql2`: Cliente de base de datos MySQL para Node.js, con soporte para Promises.
*   `node-cron`: Para programar tareas recurrentes (jobs), como el envío de recordatorios.
*   `nodemailer`: Para el envío de correos electrónicos (notificaciones, encuestas, etc.).

### Dependencias de Desarrollo (`devDependencies`)

*   `chalk`: Permite colorear la salida de la consola, mejorando la legibilidad de los logs en desarrollo.
*   `eslint`: Herramienta para análisis estático de código que ayuda a encontrar y corregir problemas.
*   `nodemon`: Monitorea cambios en los archivos y reinicia el servidor automáticamente, agilizando el desarrollo.
*   `swagger-jsdoc` y `swagger-ui-express`: Para generar y visualizar la documentación interactiva de la API (Swagger/OpenAPI).

### Simulación de Correo en Desarrollo

*   **Ethereal:** Para facilitar las pruebas de envío de correos sin configurar un servidor SMTP real, se utiliza Ethereal. Es un servicio que captura los correos enviados y los muestra en una bandeja de entrada web. No requiere instalación, solo la configuración en el archivo `.env.development`.