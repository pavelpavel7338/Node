-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.1.9-MariaDB - mariadb.org binary distribution
-- ОС Сервера:                   Win32
-- HeidiSQL Версия:              9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Дамп структуры базы данных node
CREATE DATABASE IF NOT EXISTS `node` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `node`;


-- Дамп структуры для таблица node.about
DROP TABLE IF EXISTS `about`;
CREATE TABLE IF NOT EXISTS `about` (
  `text` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.


-- Дамп структуры для таблица node.comments
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT 'Anonymous',
  `msg` text NOT NULL,
  `museum_gallery` tinyint(3) unsigned NOT NULL,
  `p_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `museum_gallery` (`museum_gallery`),
  KEY `p_id` (`p_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.


-- Дамп структуры для таблица node.gallery
DROP TABLE IF EXISTS `gallery`;
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `m_id` int(10) unsigned NOT NULL,
  `alias` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `alias` (`alias`),
  KEY `m_id` (`m_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.


-- Дамп структуры для таблица node.museum
DROP TABLE IF EXISTS `museum`;
CREATE TABLE IF NOT EXISTS `museum` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `descr` text NOT NULL,
  `text` text NOT NULL,
  `img` varchar(255) NOT NULL,
  `alias` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.


-- Дамп структуры для таблица node.orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `b_id` int(10) unsigned NOT NULL,
  `b_name` varchar(255) NOT NULL,
  `b_email` varchar(255) NOT NULL,
  `b_tel` varchar(255) NOT NULL,
  `b_addr` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `b_id` (`b_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.


-- Дамп структуры для таблица node.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  KEY `password` (`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
