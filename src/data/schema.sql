-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)

DROP TABLE IF EXISTS comentarios;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE comentarios (
  comentario_id int NOT NULL AUTO_INCREMENT,
  reserva_id int NOT NULL,
  usuario_id int NOT NULL,
  comentario text NOT NULL,
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comentario_id),
  KEY reserva_id (reserva_id),
  KEY usuario_id (usuario_id),
  CONSTRAINT comentarios_fk_reserva FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id) ON DELETE CASCADE,
  CONSTRAINT comentarios_fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table comentarios
--

LOCK TABLES comentarios WRITE;
/*!40000 ALTER TABLE comentarios DISABLE KEYS */;
INSERT INTO comentarios VALUES (1,1,4,'Pago 50% recibido. Cliente avisado.','2025-11-08 20:04:51'),(2,1,4,'Pago 50% recibido. Cliente avisadooooooooooooooo.','2025-11-08 23:52:01');
/*!40000 ALTER TABLE comentarios ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table encuestas
--

DROP TABLE IF EXISTS encuestas;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE encuestas (
  encuesta_id int NOT NULL AUTO_INCREMENT,
  reserva_id int NOT NULL,
  usuario_id int NOT NULL,
  puntuacion tinyint NOT NULL,
  comentarios text,
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (encuesta_id),
  KEY reserva_id (reserva_id),
  KEY usuario_id (usuario_id),
  CONSTRAINT encuestas_fk_reserva FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id) ON DELETE CASCADE,
  CONSTRAINT encuestas_fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table encuestas
--

LOCK TABLES encuestas WRITE;
/*!40000 ALTER TABLE encuestas DISABLE KEYS */;
INSERT INTO encuestas VALUES (1,11,3,5,'Todo excelente, volvería!','2025-11-08 19:58:58'),(2,1,1,5,'Todo excelenteeeeeeeee, volvería!','2025-11-08 21:53:57');
/*!40000 ALTER TABLE encuestas ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table invitados
--

DROP TABLE IF EXISTS invitados;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE invitados (
  invitado_id int NOT NULL AUTO_INCREMENT,
  reserva_id int NOT NULL,
  nombre varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  apellido varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  edad int DEFAULT NULL,
  email varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  creado timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  modificado timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  activo tinyint(1) DEFAULT '1',
  PRIMARY KEY (invitado_id),
  KEY reserva_id (reserva_id),
  CONSTRAINT invitados_ibfk_1 FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table invitados
--

LOCK TABLES invitados WRITE;
/*!40000 ALTER TABLE invitados DISABLE KEYS */;
INSERT INTO invitados VALUES (1,14,'dario','barassi',40,'dariob@gmail.com','2025-11-09 03:06:44','2025-11-09 03:06:44',1),(2,11,'striwernerng','perez',40,'perez@si.com','2025-11-09 03:19:38','2025-11-09 11:43:32',0),(3,11,'elizabeth','tamburrisanabria',40,'tamburri@correo.com','2025-11-09 03:44:12','2025-11-09 03:44:12',1),(4,11,'leooooooon','rodriguez',60,'leonrodriguez@gmil.clom','2025-11-09 03:57:37','2025-11-09 03:57:37',1),(5,11,'carlos','carlitos',NULL,NULL,'2025-11-09 04:02:52','2025-11-09 11:45:32',1);
/*!40000 ALTER TABLE invitados ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table reservas
--

DROP TABLE IF EXISTS reservas;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE reservas (
  reserva_id int NOT NULL AUTO_INCREMENT,
  fecha_reserva date NOT NULL,
  salon_id int NOT NULL,
  usuario_id int NOT NULL,
  turno_id int NOT NULL,
  foto_cumpleaniero varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  tematica varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  ruta_comprobante varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  importe_salon decimal(10,2) DEFAULT NULL,
  importe_total decimal(10,2) DEFAULT NULL,
  activo tinyint(1) DEFAULT '1',
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  modificado datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reserva_id),
  KEY salon_id (salon_id),
  KEY usuario_id (usuario_id),
  KEY turno_id (turno_id),
  CONSTRAINT reservas_ibfk_1 FOREIGN KEY (salon_id) REFERENCES salones (salon_id),
  CONSTRAINT reservas_ibfk_2 FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id),
  CONSTRAINT reservas_ibfk_3 FOREIGN KEY (turno_id) REFERENCES turnos (turno_id)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table reservas
--

LOCK TABLES reservas WRITE;
/*!40000 ALTER TABLE reservas DISABLE KEYS */;
INSERT INTO reservas VALUES (1,'2025-11-10',1,1,1,NULL,'Plim plim',NULL,NULL,200000.00,1,'2025-11-05 11:51:37','2025-11-09 15:38:17'),(2,'2025-10-08',2,1,1,NULL,'Messi',NULL,NULL,100000.00,1,'2025-11-05 11:51:37','2025-11-05 11:51:37'),(3,'2025-10-08',2,2,1,NULL,'Palermo',NULL,NULL,500000.00,1,'2025-11-05 11:51:37','2025-11-05 11:51:37'),(4,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,'2025-11-05 13:56:13','2025-11-05 13:56:19'),(5,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,'2025-11-05 18:48:31','2025-11-05 18:48:32'),(6,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,'2025-11-05 18:59:35','2025-11-05 18:59:35'),(7,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,'2025-11-05 21:17:35','2025-11-05 21:17:35'),(8,'2025-11-10',1,1,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,'2025-11-05 21:23:41','2025-11-05 21:23:41'),(9,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',NULL,95000.00,135000.00,1,'2025-11-06 17:12:38','2025-11-06 17:12:40'),(10,'2085-11-20',1,3,2,NULL,NULL,'public\\uploads\\comprobantes\\comprobante-user-3-1762635250968.png',50000.00,80000.00,0,'2025-11-08 17:54:11','2025-11-08 18:11:36'),(11,'2024-11-10',1,3,2,NULL,NULL,'public\\uploads\\comprobantes\\comprobante-user-3-1762642694304.png',50000.00,75000.00,1,'2025-11-08 19:58:14','2025-11-08 19:58:14'),(12,'2024-11-10',1,3,2,NULL,NULL,'public\\uploads\\comprobantes\\comprobante-user-1-1762649313628.png',50000.00,75000.00,1,'2025-11-08 21:48:33','2025-11-08 21:48:34'),(13,'2001-01-10',1,3,2,NULL,NULL,'public\\uploads\\comprobantes\\comprobante-user-1-1762649496515.png',50000.00,75000.00,1,'2025-11-08 21:51:36','2025-11-08 21:51:36'),(14,'2025-11-10',1,3,2,NULL,NULL,'public\\uploads\\comprobantes\\comprobante-user-3-1762657532223.png',9999.00,34999.00,1,'2025-11-09 00:05:32','2025-11-09 00:05:32');
/*!40000 ALTER TABLE reservas ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table reservas_servicios
--

DROP TABLE IF EXISTS reservas_servicios;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE reservas_servicios (
  reserva_servicio_id int NOT NULL AUTO_INCREMENT,
  reserva_id int NOT NULL,
  servicio_id int NOT NULL,
  importe decimal(10,2) NOT NULL,
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  modificado datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (reserva_servicio_id),
  KEY reserva_id (reserva_id),
  KEY servicio_id (servicio_id),
  CONSTRAINT reservas_servicios_ibfk_1 FOREIGN KEY (reserva_id) REFERENCES reservas (reserva_id),
  CONSTRAINT reservas_servicios_ibfk_2 FOREIGN KEY (servicio_id) REFERENCES servicios (servicio_id)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table reservas_servicios
--

LOCK TABLES reservas_servicios WRITE;
/*!40000 ALTER TABLE reservas_servicios DISABLE KEYS */;
INSERT INTO reservas_servicios VALUES (1,1,1,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(2,1,2,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(3,1,3,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(4,1,4,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(5,2,1,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(6,2,2,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(7,3,1,100000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(8,3,2,100000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(9,3,3,100000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(10,3,4,200000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(11,4,1,15000.00,'2025-11-05 13:56:19','2025-11-05 13:56:19'),(12,4,2,25000.00,'2025-11-05 13:56:19','2025-11-05 13:56:19'),(13,5,1,15000.00,'2025-11-05 18:48:32','2025-11-05 18:48:32'),(14,5,2,25000.00,'2025-11-05 18:48:32','2025-11-05 18:48:32'),(15,6,1,15000.00,'2025-11-05 18:59:35','2025-11-05 18:59:35'),(16,6,2,25000.00,'2025-11-05 18:59:35','2025-11-05 18:59:35'),(17,7,1,15000.00,'2025-11-05 21:17:35','2025-11-05 21:17:35'),(18,7,2,25000.00,'2025-11-05 21:17:35','2025-11-05 21:17:35'),(19,8,1,15000.00,'2025-11-05 21:23:41','2025-11-05 21:23:41'),(20,8,2,25000.00,'2025-11-05 21:23:41','2025-11-05 21:23:41'),(21,9,1,15000.00,'2025-11-06 17:12:39','2025-11-06 17:12:39'),(22,9,2,25000.00,'2025-11-06 17:12:40','2025-11-06 17:12:40'),(23,10,1,15000.00,'2025-11-08 17:54:11','2025-11-08 17:54:11'),(24,10,2,10000.00,'2025-11-08 17:54:11','2025-11-08 17:54:11'),(25,11,1,15000.00,'2025-11-08 19:58:14','2025-11-08 19:58:14'),(26,11,2,10000.00,'2025-11-08 19:58:14','2025-11-08 19:58:14'),(27,12,1,15000.00,'2025-11-08 21:48:34','2025-11-08 21:48:34'),(28,12,2,10000.00,'2025-11-08 21:48:34','2025-11-08 21:48:34'),(29,13,1,15000.00,'2025-11-08 21:51:36','2025-11-08 21:51:36'),(30,13,2,10000.00,'2025-11-08 21:51:36','2025-11-08 21:51:36'),(31,14,1,15000.00,'2025-11-09 00:05:32','2025-11-09 00:05:32'),(32,14,2,10000.00,'2025-11-09 00:05:32','2025-11-09 00:05:32');
/*!40000 ALTER TABLE reservas_servicios ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table salones
--

DROP TABLE IF EXISTS salones;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE salones (
  salon_id int NOT NULL AUTO_INCREMENT,
  titulo varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  direccion varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  latitud decimal(10,8) DEFAULT NULL,
  longitud decimal(11,8) DEFAULT NULL,
  capacidad int DEFAULT NULL,
  importe decimal(10,2) NOT NULL,
  activo tinyint(1) DEFAULT '1',
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  modificado datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (salon_id)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table salones
--

LOCK TABLES salones WRITE;
/*!40000 ALTER TABLE salones DISABLE KEYS */;
INSERT INTO salones VALUES (1,'Principal','San Lorenzo 1000',NULL,NULL,200,95000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(2,'Secundario','San Lorenzo 1000',NULL,NULL,70,7000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(3,'Salón Verde','Calle Real 456',NULL,NULL,80,7000.00,0,'2025-11-05 11:51:36','2025-11-08 15:15:34'),(4,'Maquina de Jugar','Peru 50',NULL,NULL,100,95000.00,0,'2025-11-05 11:51:36','2025-11-08 14:55:13'),(5,'Trampolín Play','Belgrano 100',NULL,NULL,70,200000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(6,'Salón wernerdo','San carmencita 1000',-31.63100000,-60.70200000,80,80000.00,1,'2025-11-08 15:06:41','2025-11-08 15:06:41');
/*!40000 ALTER TABLE salones ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table servicios
--

DROP TABLE IF EXISTS servicios;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE servicios (
  servicio_id int NOT NULL AUTO_INCREMENT,
  descripcion varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  importe decimal(10,2) NOT NULL,
  activo tinyint(1) NOT NULL DEFAULT '1',
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  modificado datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (servicio_id)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table servicios
--

LOCK TABLES servicios WRITE;
/*!40000 ALTER TABLE servicios DISABLE KEYS */;
INSERT INTO servicios VALUES (1,'Sonido profesionaaal',18000.00,1,'2025-11-05 11:51:36','2025-11-08 15:19:05'),(2,'Mesa dulce',25000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(3,'Tarjetas de invitación',5000.00,0,'2025-11-05 11:51:36','2025-11-08 15:14:35'),(4,'Mozos',15000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(5,'Sala de video juegos',15000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(6,'Mago',25000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(7,'Cabezones',80000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(8,'Maquillaje infantil',1000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36');
/*!40000 ALTER TABLE servicios ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table turnos
--

DROP TABLE IF EXISTS turnos;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE turnos (
  turno_id int NOT NULL AUTO_INCREMENT,
  orden int NOT NULL,
  hora_desde time NOT NULL,
  hora_hasta time NOT NULL,
  activo tinyint(1) NOT NULL DEFAULT '1',
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  modificado datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (turno_id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table turnos
--

LOCK TABLES turnos WRITE;
/*!40000 ALTER TABLE turnos DISABLE KEYS */;
INSERT INTO turnos VALUES (1,4,'17:00:00','19:00:00',0,'2025-11-05 11:51:35','2025-11-08 15:27:52'),(2,2,'15:00:00','17:00:00',0,'2025-11-05 11:51:35','2025-11-08 15:59:23'),(3,3,'18:00:00','20:00:00',1,'2025-11-05 11:51:35','2025-11-05 11:51:35'),(4,3,'16:00:00','18:00:00',1,'2025-11-08 15:25:59','2025-11-08 15:25:59');
/*!40000 ALTER TABLE turnos ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table usuarios
--

DROP TABLE IF EXISTS usuarios;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE usuarios (
  usuario_id int NOT NULL AUTO_INCREMENT,
  nombre varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  apellido varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  nombre_usuario varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  password varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  tipo_usuario tinyint NOT NULL,
  celular varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  foto varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  activo tinyint(1) NOT NULL DEFAULT '1',
  creado datetime DEFAULT CURRENT_TIMESTAMP,
  modificado datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id),
  UNIQUE KEY nombre_usuario (nombre_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table usuarios
--

LOCK TABLES usuarios WRITE;
/*!40000 ALTER TABLE usuarios DISABLE KEYS */;
INSERT INTO usuarios VALUES (1,'Alberto','López','alblop@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',3,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-08 12:57:20'),(2,'Pamela','Gómez','pamgom@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',3,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-08 12:57:20'),(3,'Esteban','Ciro','estcir@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',3,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-08 12:57:20'),(4,'Oscar','Ramirez','oscram@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',1,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-08 12:57:21'),(6,'William','Corbalán','wilcor@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',2,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-08 12:57:21'),(7,'Anahí','Flores','anaflo@correo.com','$2b$10$wYl7cpr.Fv.ydkmBTR9ddeJVxfIC2FH2EH5fl0G05KGvD/GnoyUDm',2,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-08 12:57:21');
/*!40000 ALTER TABLE usuarios ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
