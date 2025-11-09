-- ------------------------------------------------------
-- Base de datos: reservas
-- Dump listo para importar
-- ------------------------------------------------------

DROP DATABASE IF EXISTS reservas;
CREATE DATABASE reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reservas;

-- ------------------------------------------------------
-- Estructura de tabla para `usuarios`
-- ------------------------------------------------------
CREATE TABLE usuarios (
  usuario_id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255),
  tipo_usuario TINYINT NOT NULL,
  celular VARCHAR(20),
  foto VARCHAR(255),
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO usuarios VALUES 
(1,'Alberto','López','alblop@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',3,NULL,NULL,1,NOW(),NOW()),
(2,'Pamela','Gómez','pamgom@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',3,NULL,NULL,1,NOW(),NOW()),
(3,'Esteban','Ciro','estcir@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',3,NULL,NULL,1,NOW(),NOW()),
(4,'Oscar','Ramirez','oscram@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',1,NULL,NULL,1,NOW(),NOW()),
(6,'William','Corbalán','wilcor@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',2,NULL,NULL,1,NOW(),NOW()),
(7,'Anahí','Flores','anaflo@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',2,NULL,NULL,1,NOW(),NOW());

-- ------------------------------------------------------
-- Tabla: salones
-- ------------------------------------------------------
CREATE TABLE salones (
  salon_id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10,8),
  longitud DECIMAL(11,8),
  capacidad INT,
  importe DECIMAL(10,2) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (salon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO salones VALUES
(1,'Principal','San Lorenzo 1000',NULL,NULL,200,95000.00,1,NOW(),NOW()),
(2,'Secundario','San Lorenzo 1000',NULL,NULL,70,7000.00,1,NOW(),NOW()),
(3,'Salón Verde','Calle Real 456',NULL,NULL,80,7000.00,0,NOW(),NOW()),
(4,'Maquina de Jugar','Peru 50',NULL,NULL,100,95000.00,0,NOW(),NOW()),
(5,'Trampolín Play','Belgrano 100',NULL,NULL,70,200000.00,1,NOW(),NOW()),
(6,'Salón wernerdo','San carmencita 1000',-31.63100000,-60.70200000,80,80000.00,1,NOW(),NOW());

-- ------------------------------------------------------
-- Tabla: turnos
-- ------------------------------------------------------
CREATE TABLE turnos (
  turno_id INT NOT NULL AUTO_INCREMENT,
  orden INT NOT NULL,
  hora_desde TIME NOT NULL,
  hora_hasta TIME NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (turno_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO turnos VALUES
(1,4,'17:00:00','19:00:00',0,NOW(),NOW()),
(2,2,'15:00:00','17:00:00',0,NOW(),NOW()),
(3,3,'18:00:00','20:00:00',1,NOW(),NOW()),
(4,3,'16:00:00','18:00:00',1,NOW(),NOW());

-- ------------------------------------------------------
-- Tabla: servicios
-- ------------------------------------------------------
CREATE TABLE servicios (
  servicio_id INT NOT NULL AUTO_INCREMENT,
  descripcion VARCHAR(255) NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO servicios VALUES
(1,'Sonido profesionaaal',18000.00,1,NOW(),NOW()),
(2,'Mesa dulce',25000.00,1,NOW(),NOW()),
(3,'Tarjetas de invitación',5000.00,0,NOW(),NOW()),
(4,'Mozos',15000.00,1,NOW(),NOW()),
(5,'Sala de video juegos',15000.00,1,NOW(),NOW()),
(6,'Mago',25000.00,1,NOW(),NOW()),
(7,'Cabezones',80000.00,1,NOW(),NOW()),
(8,'Maquillaje infantil',1000.00,1,NOW(),NOW());

-- ------------------------------------------------------
-- Tabla: reservas
-- ------------------------------------------------------
CREATE TABLE reservas (
  reserva_id INT NOT NULL AUTO_INCREMENT,
  fecha_reserva DATE NOT NULL,
  salon_id INT NOT NULL,
  usuario_id INT NOT NULL,
  turno_id INT NOT NULL,
  foto_cumpleaniero VARCHAR(255),
  tematica VARCHAR(255),
  ruta_comprobante VARCHAR(255),
  importe_salon DECIMAL(10,2),
  importe_total DECIMAL(10,2),
  activo TINYINT(1) DEFAULT 1,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reserva_id),
  FOREIGN KEY (salon_id) REFERENCES salones(salon_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
  FOREIGN KEY (turno_id) REFERENCES turnos(turno_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO reservas VALUES
(1,'2025-10-08',1,1,1,NULL,'Plim plim',NULL,NULL,200000.00,1,NOW(),NOW()),
(2,'2025-10-08',2,1,1,NULL,'Messi',NULL,NULL,100000.00,1,NOW(),NOW()),
(3,'2025-10-08',2,2,1,NULL,'Palermo',NULL,NULL,500000.00,1,NOW(),NOW()),
(4,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,NOW(),NOW()),
(10,'2085-11-20',1,3,2,NULL,NULL,'public/uploads/comprobantes/comprobante-user-3.png',50000.00,80000.00,0,NOW(),NOW()),
(11,'2024-11-10',1,3,2,NULL,NULL,'public/uploads/comprobantes/comprobante-user-3.png',50000.00,75000.00,1,NOW(),NOW());

-- ------------------------------------------------------
-- Tabla: reservas_servicios
-- ------------------------------------------------------
CREATE TABLE reservas_servicios (
  reserva_servicio_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  servicio_id INT NOT NULL,
  importe DECIMAL(10,2) NOT NULL,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  modificado DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reserva_servicio_id),
  FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id),
  FOREIGN KEY (servicio_id) REFERENCES servicios(servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO reservas_servicios VALUES
(1,1,1,50000.00,NOW(),NOW()),
(2,1,2,50000.00,NOW(),NOW()),
(3,3,4,200000.00,NOW(),NOW());

-- ------------------------------------------------------
-- Tabla: comentarios
-- ------------------------------------------------------
CREATE TABLE comentarios (
  comentario_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  usuario_id INT NOT NULL,
  comentario TEXT NOT NULL,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comentario_id),
  FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO comentarios VALUES
(1,1,4,'Pago 50% recibido. Cliente avisado.',NOW());

-- ------------------------------------------------------
-- Tabla: encuestas
-- ------------------------------------------------------
CREATE TABLE encuestas (
  encuesta_id INT NOT NULL AUTO_INCREMENT,
  reserva_id INT NOT NULL,
  usuario_id INT NOT NULL,
  puntuacion TINYINT NOT NULL,
  comentarios TEXT,
  creado DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (encuesta_id),
  FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO encuestas VALUES
(1,11,3,5,'Todo excelente, volvería!',NOW()),
(2,1,1,5,'Todo excelenteeeeeeeee, volvería!',NOW());
