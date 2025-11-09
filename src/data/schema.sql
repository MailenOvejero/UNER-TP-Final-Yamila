--
-- Esquema de la base de datos 'reservas'
-- Generado a partir del dump de MySQL.
--

-- Se recomienda usar la base de datos 'reservas'
-- USE reservas;

SET FOREIGN_KEY_CHECKS = 0; -- Deshabilitar temporalmente la verificación de FK para evitar problemas de dependencia en el orden de creación.

---
## Estructura de la Tabla `salones`
---
CREATE TABLE salones (
  salon_id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  direccion VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  latitud DECIMAL(10,8) DEFAULT NULL,
  longitud DECIMAL(11,8) DEFAULT NULL,
  capacidad INT DEFAULT NULL,
  importe DECIMAL(10,2) NOT NULL,
  activo TINYINT(1) DEFAULT '1',
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (salon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---
## Estructura de la Tabla `turnos`
---
CREATE TABLE turnos (
  turno_id INT NOT NULL AUTO_INCREMENT,
  orden INT NOT NULL,
  hora_desde TIME NOT NULL,
  hora_hasta TIME NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT '1',
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (turno_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---
## Estructura de la Tabla `usuarios`
---
CREATE TABLE usuarios (
  usuario_id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  apellido VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  nombre_usuario VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  password VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  tipo_usuario TINYINT NOT NULL,
  celular VARCHAR(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  foto VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  activo TINYINT(1) NOT NULL DEFAULT '1',
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id),
  UNIQUE KEY nombre_usuario (nombre_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---
## Estructura de la Tabla `reservas`
---
CREATE TABLE reservas (
  reserva_id INT NOT NULL AUTO_INCREMENT,
  fecha_reserva DATE NOT NULL,
  salon_id INT NOT NULL,
  usuario_id INT NOT NULL,
  turno_id INT NOT NULL,
  foto_cumpleaniero VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  tematica VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  ruta_comprobante VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  importe_salon DECIMAL(10,2) DEFAULT NULL,
  importe_total DECIMAL(10,2) DEFAULT NULL,
  activo TINYINT(1) DEFAULT '1',
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reserva_id),
  KEY salon_id (salon_id),
  KEY usuario_id (usuario_id),
  KEY turno_id (turno_id),
  CONSTRAINT reservas_ibfk_1 FOREIGN KEY (salon_id) REFERENCES salones (salon_id),
  CONSTRAINT reservas_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id),
  CONSTRAINT reservas_ibfk_3 FOREIGN KEY (turno_id) REFERENCES turnos (turno_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---
## Estructura de la Tabla `comentarios`
---
CREATE TABLE comentarios (
  comentario_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  usuario_id INT NOT NULL,
  comentario TEXT NOT NULL,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comentario_id),
  KEY reserva_id (reserva_id),
  KEY usuario_id (usuario_id),
  CONSTRAINT comentarios_fk_reserva FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id) ON DELETE CASCADE,
  CONSTRAINT comentarios_fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

---
## Estructura de la Tabla `encuestas`
---
CREATE TABLE encuestas (
  encuesta_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  usuario_id INT NOT NULL,
  puntuacion TINYINT NOT NULL,
  comentarios TEXT,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (encuesta_id),
  KEY reserva_id (reserva_id),
  KEY usuario_id (usuario_id),
  CONSTRAINT encuestas_fk_reserva FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id) ON DELETE CASCADE,
  CONSTRAINT encuestas_fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

---
## Estructura de la Tabla `invitados`
---
CREATE TABLE invitados (
  invitado_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  nombre VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  apellido VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  edad INT DEFAULT NULL,
  email VARCHAR(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  creado TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  modificado TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  activo TINYINT(1) DEFAULT '1',
  PRIMARY KEY (invitado_id),
  KEY reserva_id (reserva_id),
  CONSTRAINT invitados_ibfk_1 FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---
## Estructura de la Tabla `servicios`
---
CREATE TABLE servicios (
  servicio_id INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT '1',
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---
## Estructura de la Tabla `reservas_servicios`
---
CREATE TABLE reservas_servicios (
  reserva_servicio_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  servicio_id INT NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reserva_servicio_id),
  KEY reserva_id (reserva_id),
  KEY servicio_id (servicio_id),
  CONSTRAINT reservas_servicios_ibfk_1 FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id),
  CONSTRAINT reservas_servicios_ibfk_2 FOREIGN KEY (servicio_id) REFERENCES servicios (servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1; -- Habilitar nuevamente la verificación de FK.