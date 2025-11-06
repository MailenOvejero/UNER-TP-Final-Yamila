-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: reservas
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `reserva_id` int NOT NULL AUTO_INCREMENT,
  `fecha_reserva` date NOT NULL,
  `salon_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `turno_id` int NOT NULL,
  `foto_cumpleaniero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tematica` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `importe_salon` decimal(10,2) DEFAULT NULL,
  `importe_total` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificado` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reserva_id`),
  KEY `salon_id` (`salon_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `turno_id` (`turno_id`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`salon_id`) REFERENCES `salones` (`salon_id`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`turno_id`) REFERENCES `turnos` (`turno_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,'2025-10-08',1,1,1,NULL,'Plim plim',NULL,200000.00,1,'2025-11-05 11:51:37','2025-11-05 11:51:37'),(2,'2025-10-08',2,1,1,NULL,'Messi',NULL,100000.00,1,'2025-11-05 11:51:37','2025-11-05 11:51:37'),(3,'2025-10-08',2,2,1,NULL,'Palermo',NULL,500000.00,1,'2025-11-05 11:51:37','2025-11-05 11:51:37'),(4,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',95000.00,135000.00,1,'2025-11-05 13:56:13','2025-11-05 13:56:19'),(5,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',95000.00,135000.00,1,'2025-11-05 18:48:31','2025-11-05 18:48:32'),(6,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',95000.00,135000.00,1,'2025-11-05 18:59:35','2025-11-05 18:59:35'),(7,'2025-11-10',1,2,2,NULL,'Fiesta de superhéroes',95000.00,135000.00,1,'2025-11-05 21:17:35','2025-11-05 21:17:35'),(8,'2025-11-10',1,1,2,NULL,'Fiesta de superhéroes',95000.00,135000.00,1,'2025-11-05 21:23:41','2025-11-05 21:23:41');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas_servicios`
--

DROP TABLE IF EXISTS `reservas_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas_servicios` (
  `reserva_servicio_id` int NOT NULL AUTO_INCREMENT,
  `reserva_id` int NOT NULL,
  `servicio_id` int NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificado` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`reserva_servicio_id`),
  KEY `reserva_id` (`reserva_id`),
  KEY `servicio_id` (`servicio_id`),
  CONSTRAINT `reservas_servicios_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`reserva_id`),
  CONSTRAINT `reservas_servicios_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`servicio_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas_servicios`
--

LOCK TABLES `reservas_servicios` WRITE;
/*!40000 ALTER TABLE `reservas_servicios` DISABLE KEYS */;
INSERT INTO `reservas_servicios` VALUES (1,1,1,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(2,1,2,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(3,1,3,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(4,1,4,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(5,2,1,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(6,2,2,50000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(7,3,1,100000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(8,3,2,100000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(9,3,3,100000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(10,3,4,200000.00,'2025-11-05 11:51:38','2025-11-05 11:51:38'),(11,4,1,15000.00,'2025-11-05 13:56:19','2025-11-05 13:56:19'),(12,4,2,25000.00,'2025-11-05 13:56:19','2025-11-05 13:56:19'),(13,5,1,15000.00,'2025-11-05 18:48:32','2025-11-05 18:48:32'),(14,5,2,25000.00,'2025-11-05 18:48:32','2025-11-05 18:48:32'),(15,6,1,15000.00,'2025-11-05 18:59:35','2025-11-05 18:59:35'),(16,6,2,25000.00,'2025-11-05 18:59:35','2025-11-05 18:59:35'),(17,7,1,15000.00,'2025-11-05 21:17:35','2025-11-05 21:17:35'),(18,7,2,25000.00,'2025-11-05 21:17:35','2025-11-05 21:17:35'),(19,8,1,15000.00,'2025-11-05 21:23:41','2025-11-05 21:23:41'),(20,8,2,25000.00,'2025-11-05 21:23:41','2025-11-05 21:23:41');
/*!40000 ALTER TABLE `reservas_servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salones`
--

DROP TABLE IF EXISTS `salones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salones` (
  `salon_id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `capacidad` int DEFAULT NULL,
  `importe` decimal(10,2) NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificado` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`salon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salones`
--

LOCK TABLES `salones` WRITE;
/*!40000 ALTER TABLE `salones` DISABLE KEYS */;
INSERT INTO `salones` VALUES (1,'Principal','San Lorenzo 1000',NULL,NULL,200,95000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(2,'Secundario','San Lorenzo 1000',NULL,NULL,70,7000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(3,'Cancha Fútbol 5','Alberdi 300',NULL,NULL,50,150000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(4,'Maquina de Jugar','Peru 50',NULL,NULL,100,95000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(5,'Trampolín Play','Belgrano 100',NULL,NULL,70,200000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36');
/*!40000 ALTER TABLE `salones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `servicio_id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `importe` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificado` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`servicio_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Sonido',15000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(2,'Mesa dulce',25000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(3,'Tarjetas de invitación',5000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(4,'Mozos',15000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(5,'Sala de video juegos',15000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(6,'Mago',25000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(7,'Cabezones',80000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36'),(8,'Maquillaje infantil',1000.00,1,'2025-11-05 11:51:36','2025-11-05 11:51:36');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `turno_id` int NOT NULL AUTO_INCREMENT,
  `orden` int NOT NULL,
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificado` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`turno_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (1,1,'12:00:00','14:00:00',1,'2025-11-05 11:51:35','2025-11-05 11:51:35'),(2,2,'15:00:00','17:00:00',1,'2025-11-05 11:51:35','2025-11-05 11:51:35'),(3,3,'18:00:00','20:00:00',1,'2025-11-05 11:51:35','2025-11-05 11:51:35');
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_usuario` tinyint NOT NULL,
  `celular` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `modificado` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Alberto','López','alblop@correo.com','$2b$10$I1AAwMImC2y/fWNm2OusuOTwo6o7mc4NhLobUIlFIdRNlBGduwcuC',3,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:19'),(2,'Pamela','Gómez','pamgom@correo.com','$2b$10$EOYvW1clCqaKLNI46mQqbOdZGvrZV1DcQFb.lQ.z.BnmzCpuDcMoS',3,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:19'),(3,'Esteban','Ciro','estcir@correo.com','$2b$10$KdU4ENOK24PA3Wnr/x8b7OTfrl1Q4jO.UzW3hB3oleKWIk3F2Yu6W',3,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:19'),(4,'Oscar','Ramirez','oscram@correo.com','$2b$10$6vyoIGdITWWBs1yrd0tYIeobo21wOb1.gDWmtkWth7Kjg8cOhsqL2',1,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:19'),(5,'Claudia','Juárez','clajua@correo.com','$2b$10$SNiMsRKO0sGiJ7YiPpKclOEpeG28odKBQMLM.smxom4ThASH0mjfu',1,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:20'),(6,'William','Corbalán','wilcor@correo.com','$2b$10$Vmj6PAu9NBO17OUg8Q47ruGYwYCS0F4PHlAFXfqeCVSlHt9cKZ6tK',2,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:20'),(7,'Anahí','Flores','anaflo@correo.com','$2b$10$T40xX3yEk2qZvm53Z3rYVe7/zQycSBHIpQ0M4oKu6ZbOIpYe56iya',2,NULL,NULL,1,'2025-11-05 11:51:35','2025-11-06 15:07:20');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06 15:16:34
