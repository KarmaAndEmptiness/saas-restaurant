-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: restaurant
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_record`
--

DROP TABLE IF EXISTS `account_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `member_id` bigint NOT NULL COMMENT '会员ID',
  `amount` decimal(12,2) NOT NULL COMMENT '变动金额',
  `type` tinyint NOT NULL COMMENT '类型(1:充值,2:消费,3:退款)',
  `transaction_id` bigint DEFAULT NULL COMMENT '关联交易ID',
  `balance` decimal(12,2) NOT NULL COMMENT '变动后余额',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户流水表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_record`
--

LOCK TABLES `account_record` WRITE;
/*!40000 ALTER TABLE `account_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alert_record`
--

DROP TABLE IF EXISTS `alert_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alert_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `rule_id` bigint NOT NULL COMMENT '规则ID',
  `alert_content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '预警内容',
  `alert_level` tinyint NOT NULL COMMENT '预警级别(1:提示,2:警告,3:严重)',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:未处理,2:已处理)',
  `handle_time` datetime DEFAULT NULL COMMENT '处理时间',
  `handle_desc` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理说明',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_rule_id` (`rule_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alert_record`
--

LOCK TABLES `alert_record` WRITE;
/*!40000 ALTER TABLE `alert_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `alert_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alert_rule`
--

DROP TABLE IF EXISTS `alert_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alert_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `rule_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规则名称',
  `rule_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规则类型',
  `rule_condition` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '规则条件(JSON格式)',
  `alert_method` tinyint NOT NULL COMMENT '通知方式(1:系统,2:邮件,3:短信)',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警规则表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alert_rule`
--

LOCK TABLES `alert_rule` WRITE;
/*!40000 ALTER TABLE `alert_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `alert_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_record`
--

DROP TABLE IF EXISTS `campaign_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `campaign_id` bigint NOT NULL COMMENT '活动ID',
  `member_id` bigint NOT NULL COMMENT '会员ID',
  `transaction_id` bigint NOT NULL COMMENT '交易ID',
  `benefit_amount` decimal(12,2) NOT NULL COMMENT '优惠金额',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_campaign_id` (`campaign_id`),
  KEY `idx_member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动参与记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_record`
--

LOCK TABLES `campaign_record` WRITE;
/*!40000 ALTER TABLE `campaign_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '员工ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码(加密存储)',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'young','$argon2id$v=19$m=65536,t=2,p=1$DHjNAcclM8sWoiAFoZlNsw$8rdlyEO3106vupJBLWYY3nZRDfsgIdu1VuatCbQa2f8','young','18788888888','young12@qq.com',1,'2025-01-19 15:58:18','2025-01-20 19:18:26',NULL),(2,'lisi','$argon2id$v=19$m=65536,t=2,p=1$nwCP9bSQSbnQpyo4vv8uvA$I3+oCfTG14Dzi3KCmKEHj/u8DBEmkOTcve4H+RNdCjY','lisi','12345678910','lisi@qq.com',0,'2025-01-21 10:28:41','2025-01-21 15:11:35',NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_role`
--

DROP TABLE IF EXISTS `employee_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `employee_id` bigint NOT NULL COMMENT '员工ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工角色关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_role`
--

LOCK TABLES `employee_role` WRITE;
/*!40000 ALTER TABLE `employee_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marketing_campaign`
--

DROP TABLE IF EXISTS `marketing_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marketing_campaign` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `campaign_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '活动名称',
  `campaign_type` tinyint NOT NULL COMMENT '活动类型(1:折扣,2:满减,3:积分加倍)',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `discount_rate` decimal(4,2) DEFAULT NULL COMMENT '折扣率',
  `min_amount` decimal(12,2) DEFAULT NULL COMMENT '满足金额',
  `reduce_amount` decimal(12,2) DEFAULT NULL COMMENT '减少金额',
  `points_rate` int DEFAULT NULL COMMENT '积分倍率',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:未开始,2:进行中,3:已结束)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_end_time` (`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='营销活动表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marketing_campaign`
--

LOCK TABLES `marketing_campaign` WRITE;
/*!40000 ALTER TABLE `marketing_campaign` DISABLE KEYS */;
/*!40000 ALTER TABLE `marketing_campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  `member_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '会员号',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码(加密存储)',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `gender` tinyint DEFAULT NULL COMMENT '性别(1:男,2:女)',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `total_points` bigint NOT NULL DEFAULT '0' COMMENT '总积分',
  `available_points` bigint NOT NULL DEFAULT '0' COMMENT '可用积分',
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '累计消费金额',
  `member_level` tinyint NOT NULL DEFAULT '1' COMMENT '会员等级',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:正常,0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_member_no` (`member_no`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_account`
--

DROP TABLE IF EXISTS `member_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_account` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '账户ID',
  `member_id` bigint NOT NULL COMMENT '会员ID',
  `balance` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '账户余额',
  `frozen_balance` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '冻结余额',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:正常,0:冻结)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员账户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_account`
--

LOCK TABLES `member_account` WRITE;
/*!40000 ALTER TABLE `member_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_level`
--

DROP TABLE IF EXISTS `member_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_level` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '等级ID',
  `level_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '等级名称',
  `min_points` bigint NOT NULL COMMENT '最小积分',
  `max_points` bigint DEFAULT NULL COMMENT '最大积分',
  `discount_rate` decimal(4,2) NOT NULL COMMENT '折扣率',
  `level_desc` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '等级描述',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员等级表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_level`
--

LOCK TABLES `member_level` WRITE;
/*!40000 ALTER TABLE `member_level` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `parent_id` bigint DEFAULT NULL COMMENT '父权限ID',
  `perm_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限名称',
  `perm_type` tinyint NOT NULL COMMENT '权限类型(1:菜单,2:按钮,3:接口)',
  `perm_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限标识',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_perm_code` (`perm_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `point_record`
--

DROP TABLE IF EXISTS `point_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `member_id` bigint NOT NULL COMMENT '会员ID',
  `points` bigint NOT NULL COMMENT '积分变动数量',
  `type` tinyint NOT NULL COMMENT '类型(1:获得,2:使用,3:过期)',
  `source` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '来源',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员积分记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_record`
--

LOCK TABLES `point_record` WRITE;
/*!40000 ALTER TABLE `point_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `point_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `role_desc` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色描述',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permission` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  `permission_id` bigint NOT NULL COMMENT '权限ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_config`
--

DROP TABLE IF EXISTS `system_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置键',
  `config_value` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '配置值',
  `config_desc` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '配置描述',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(1:启用,0:禁用)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_config`
--

LOCK TABLES `system_config` WRITE;
/*!40000 ALTER TABLE `system_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_log`
--

DROP TABLE IF EXISTS `system_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `employee_id` bigint DEFAULT NULL COMMENT '操作员工ID',
  `operation_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作类型',
  `operation_desc` text COLLATE utf8mb4_unicode_ci COMMENT '操作描述',
  `ip_address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'IP地址',
  `operation_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_operation_time` (`operation_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_log`
--

LOCK TABLES `system_log` WRITE;
/*!40000 ALTER TABLE `system_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '交易ID',
  `transaction_no` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '交易编号',
  `member_id` bigint DEFAULT NULL COMMENT '会员ID',
  `amount` decimal(12,2) NOT NULL COMMENT '交易金额',
  `payment_amount` decimal(12,2) NOT NULL COMMENT '支付金额',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT '优惠金额',
  `points_used` bigint NOT NULL DEFAULT '0' COMMENT '使用积分',
  `payment_method` tinyint NOT NULL COMMENT '支付方式(1:现金,2:微信,3:支付宝)',
  `status` tinyint NOT NULL COMMENT '状态(1:待支付,2:已支付,3:已取消)',
  `employee_id` bigint NOT NULL COMMENT '操作员工ID',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_transaction_no` (`transaction_no`),
  KEY `idx_member_id` (`member_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交易订单表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-21 21:29:39
