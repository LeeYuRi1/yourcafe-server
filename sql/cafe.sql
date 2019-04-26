CREATE DATABASE your_cafe;
USE your_cafe;
CREATE TABLE `cafes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `opentime` time DEFAULT NULL,
  `endtime` time DEFAULT NULL,
  `satisfaction` int(10) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `create_date` datetime DEFAULT NULL,
  `update_date` datetime DEFAULT NULL,
  `images` json DEFAULT NULL,
  `smoking_fl` tinyint(1) DEFAULT '0',
  `parking_fl` tinyint(1) DEFAULT '0',
  `open_24_fl` tinyint(1) DEFAULT '0',
  `reserve_fl` tinyint(1) DEFAULT '0',
  `outside_food_fl` tinyint(1) DEFAULT '0',
  `separate_toilet_fl` tinyint(1) DEFAULT '0',
  `over_6_people_fl` tinyint(1) DEFAULT '0',
  `power_outlet_fl` tinyint(1) DEFAULT '0',
  `wifi_good_tag` tinyint(1) DEFAULT '0',
  `noisy_tag` tinyint(1) DEFAULT '0',
  `quiet_tag` tinyint(1) DEFAULT '0',
  `bright_tag` tinyint(1) DEFAULT '0',
  `darkness_tag` tinyint(1) DEFAULT '0',
  `chair_comfortable_tag` tinyint(1) DEFAULT '0',
  `toilet_clean_tag` tinyint(1) DEFAULT '0',
  `heating_cooling_weak_tag` tinyint(1) DEFAULT '0',
  `heating_cooling_powerful_tag` tinyint(1) DEFAULT '0',
  `space_spacious_tag` tinyint(1) DEFAULT '0',
  `no_tact_tag` tinyint(1) DEFAULT '0',
  `cost_effective_tag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
