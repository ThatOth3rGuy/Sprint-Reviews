-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.4.0

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
-- Table structure for table `Enrollment`
--

DROP TABLE IF EXISTS `Enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Enrollment` (
  `studentID` int NOT NULL,
  `classID` int NOT NULL,
  PRIMARY KEY (`studentID`,`classID`),
  KEY `classID` (`classID`),
  CONSTRAINT `Enrollment_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `student` (`userID`),
  CONSTRAINT `Enrollment_ibfk_2` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Enrollment`
--

LOCK TABLES `Enrollment` WRITE;
/*!40000 ALTER TABLE `Enrollment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feedback` (
  `feedbackID` int NOT NULL,
  `assignmentID` int DEFAULT NULL,
  `content` text,
  `otherStudentID` int DEFAULT NULL,
  PRIMARY KEY (`feedbackID`),
  KEY `otherStudentID` (`otherStudentID`),
  KEY `Feedback_ibfk_1` (`assignmentID`),
  CONSTRAINT `Feedback_ibfk_1` FOREIGN KEY (`assignmentID`) REFERENCES `assignment` (`assignmentID`),
  CONSTRAINT `Feedback_ibfk_2` FOREIGN KEY (`otherStudentID`) REFERENCES `student` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Submission`
--

DROP TABLE IF EXISTS `Submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Submission` (
  `submissionID` int NOT NULL,
  `assignmentID` int DEFAULT NULL,
  `content` text,
  `studentID` int DEFAULT NULL,
  PRIMARY KEY (`submissionID`),
  KEY `studentID` (`studentID`),
  KEY `Submission_ibfk_1` (`assignmentID`),
  CONSTRAINT `Submission_ibfk_1` FOREIGN KEY (`assignmentID`) REFERENCES `assignment` (`assignmentID`),
  CONSTRAINT `Submission_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `student` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Submission`
--

LOCK TABLES `Submission` WRITE;
/*!40000 ALTER TABLE `Submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `Submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `assignmentID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `rubric` text,
  `deadline` datetime DEFAULT NULL,
  `groupAssignment` tinyint(1) DEFAULT NULL,
  `classID` int DEFAULT NULL,
  PRIMARY KEY (`assignmentID`),
  KEY `classID` (`classID`),
  CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES (4,'Assignment 1','Lorem Epsum','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-06-30 00:00:00',0,1),(5,'Assignment test 2','This is to store in DB','    \0JFIF\0\0\0\0\0\0  \0 \0!!*-(-*=8338=]BGBGB] XgXXgX } {s{ }జ                  !!*-(-*=8338=]BGBGB] XgXXgX } {s{ }జ                    \0\0d\0 \"\0  \0\0\0\0\0\0\0\0\0\0\0\0\0\0\0  \0\0\0\0\0TyȺ  x   UǪw{ ˒ =6 y  n PM l  ҙ\0    Y :R   n\' ύ1     AR   t9& \"7 K8 Rܖ 	 ~    ~\'t( d  J hf N   asD 4    O \" = sH)m    h ،F k   \0\0\0\0\0\0\0\0\0\0\0\0\0\0  \0\n\0\0\0qET&  <  3  S  3# vv \0Q Q   c\\ K #:#  hf\n \' ^  \0  \00\0\0\0\0\0\0\0!1A\"Qaq# 2Bb Rr     \0\0?\0 3  C\r\0I4˯\0 1 `  0j[#m`? . \'  39 ٌ  71 HC  mA $  w ũɷb6 2 ,    c      q g 6T*    ,|w1  @ WW2 S\Z+nc~#  Bi . Mӫ  Qp ^Ӊ  p \' DjpDw,ည M	  Eɱ \\Ơ  yA a7_Q2 aq   2׃1 e8 M1(      :   \0h    A 6 N   ^&}#a Rl    0 ?  &d .NG ɍ  \r \r?K  ? 2 .ſ F  Erh} H !*. 8;CP 2  } L@ K ޢ a +g c \n     1adm     =  4A \0 % n
     òlϭBɏ    > HZ #z  ̸lݘ i r  -a  \0 B       w Fb( z  L   v F \'  %   Gkb~e       3>IɌ|     f! 0q  vc\'  qw 2  o  3  e  7 &0I ˑ]v DǑMR  O[ !   I\0    U  sD   *   mG Qr G l  $  n  Qb(  )\n\0a `-vH  XN &*Z Ļ     h8  ``c7T L\'  @@ > r\0Di    B #     i   Տ   . 8   / Bk 1`  2( 3YSb l 6 ޫ C ( \0Y3&#   Dͤ&   j( \0  F FCM g   b  >rq 34 :{-  1l   	ĄxQ3   >n]
  D2   L\'  OC qaSWF \0  p  [q   홅d?&}JU Mjz  sjH ä   <  i &W!  & C   y ,Ө) >    [\n)    O   XT
E ̀   (5\\  q hL] Ƅ  \0!\0\0\0\0\0\0\0\0\0\0\01 \"A Qq  \0?\0  [,N [/LٲL   RgT   V7 $  f  \\ % M  h G Z_  |   jG   #  \0!\0\0\0\0\0\0\0\0\0\0\0 !12Q\"AB  \0?\0Q ({4 B cMl B Y БQ}  daC f  ,^obC|   b  = Œ}\Z !  ],O   c  ','2024-06-29 00:00:00',0,1),(6,'Assignment Test 2','Lorem epsum ','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','2024-06-23 20:28:00',0,1);
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `classID` int NOT NULL,
  `className` varchar(100) DEFAULT NULL,
  `description` text,
  `isArchived` tinyint(1) DEFAULT NULL,
  `instructorID` int DEFAULT NULL,
  PRIMARY KEY (`classID`),
  KEY `instructorID` (`instructorID`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`instructorID`) REFERENCES `instructor` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,'Test Class','This is to test stuff',0,2);
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `userID` int NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `departments` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (2,0,'n/a');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `userID` int NOT NULL,
  `studentID` int DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `homeAddress` varchar(255) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  PRIMARY KEY (`userID`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pwd` varchar(100) DEFAULT NULL,
  `userRole` varchar(20) DEFAULT NULL,
  `institution` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'John','Doe','john.doe@example.com','password123','student','Example University'),(2,'Joe','Montana','joe@email.com','PAssw0rd','instructor',NULL),(3,'Patrick ','Mahommes','pat@email.com','passw0rd','student','Texas Tech');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-21 13:56:48
