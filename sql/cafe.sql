CREATE DATABASE your_cafe;
USE your_cafe;
Create Table cafes ( 
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    latitude VARCHAR(30) NOT NULL,
    longitude VARCHAR(30) NOT NULL,
    create_date DATETIME NOT NULL,
    update_date DATETIME,
    images VARCHAR(50),
    smoking_fl TINYINT(1) DEFAULT 0,
    parking_fl TINYINT(1) DEFAULT 0,
    open_24_fl TINYINT(1) DEFAULT 0,
    reserve_fl TINYINT(1) DEFAULT 0,
    outside_food_fl TINYINT(1) DEFAULT 0,
    separate_toilet_fl TINYINT(1) DEFAULT 0,
    over_6_people_fl TINYINT(1) DEFAULT 0,
    power_outlet_fl TINYINT(1) DEFAULT 0    
)
