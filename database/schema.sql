-- Production Database Schema for NutriSnap AI
CREATE DATABASE IF NOT EXISTS food_analyzer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_analyzer;

-- Food Analysis History Log
CREATE TABLE IF NOT EXISTS food_history (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  food_name VARCHAR(150) NOT NULL,
  confidence DOUBLE DEFAULT 90.0,
  cuisine VARCHAR(100) DEFAULT 'Global',
  category VARCHAR(100) DEFAULT 'General Dish',
  portion_size VARCHAR(100) DEFAULT '1 Serving',
  estimated_weight VARCHAR(100) DEFAULT '300g',
  cooking_method VARCHAR(100) DEFAULT 'Fresh Prepared',
  calories DOUBLE DEFAULT 0,
  protein DOUBLE DEFAULT 0,
  carbs DOUBLE DEFAULT 0,
  fat DOUBLE DEFAULT 0,
  fiber DOUBLE DEFAULT 0,
  sugar DOUBLE DEFAULT 0,
  health_score INT DEFAULT 75,
  image_name VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Health Goals Tracking
CREATE TABLE IF NOT EXISTS user_goals (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(100) DEFAULT 'default_user',
  goal_type VARCHAR(100) DEFAULT 'Weight Loss',
  target_calories DOUBLE DEFAULT 2000,
  target_protein DOUBLE DEFAULT 150,
  target_carbs DOUBLE DEFAULT 220,
  target_fat DOUBLE DEFAULT 65,
  target_water_liters DOUBLE DEFAULT 3.0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
