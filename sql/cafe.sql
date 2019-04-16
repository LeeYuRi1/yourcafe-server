CREATE DATABASE your_cafe;
USE your_cafe;
Create Table cafes ( 
	id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  
    name VARCHAR(20) NOT NULL,   -- 카페 이름
    latitude VARCHAR(30) NOT NULL,   -- 위도
    longitude VARCHAR(30) NOT NULL,   -- 경도
    create_date DATETIME,
    update_date DATETIME,
    images VARCHAR(50),   -- 카페 사진
    smoking_fl TINYINT(1) DEFAULT 0,   -- 흡연실
    parking_fl TINYINT(1) DEFAULT 0,   -- 주차장
    open_24_fl TINYINT(1) DEFAULT 0,   -- 24시
    reserve_fl TINYINT(1) DEFAULT 0,   -- 예약 가능
    outside_food_fl TINYINT(1) DEFAULT 0,   -- 외부 음식
    separate_toilet_fl TINYINT(1) DEFAULT 0,   -- 남녀 분리 화장실
    over_6_people_fl TINYINT(1) DEFAULT 0,   -- 6인 이상 가능
    power_outlet_fl TINYINT(1) DEFAULT 0    -- 콘센트
)
