CREATE DATABASE IF NOT EXISTS soapvox;

USE soapvox;

-- Désactivation de la vérification des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 0;

-- Suppression des tables existantes, pour moi , c'est juste moi relou avec 
DROP TABLE IF EXISTS profile_segments;
DROP TABLE IF EXISTS demo_tapes;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS segments;
DROP TABLE IF EXISTS uploads;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rythmo_bands;

-- Réactivation de la vérification des contraintes de clé étrangère
SET FOREIGN_KEY_CHECKS = 1;

-- Table for users
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for uploads
CREATE TABLE IF NOT EXISTS uploads (
  upload_id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for segments
CREATE TABLE IF NOT EXISTS segments (
  segment_id INT AUTO_INCREMENT PRIMARY KEY,
  start FLOAT NOT NULL,
  end FLOAT NOT NULL,
  text VARCHAR(255) NOT NULL,
  character_name VARCHAR(255) NOT NULL
);

-- Table for rythmo_bands
CREATE TABLE IF NOT EXISTS rythmo_bands (
  rythmo_band_id INT AUTO_INCREMENT PRIMARY KEY,
  segment_id INT NOT NULL,
  upload_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (segment_id) REFERENCES segments(segment_id) ON DELETE CASCADE,
  FOREIGN KEY (upload_id) REFERENCES uploads(upload_id) ON DELETE CASCADE
);

-- Table for profiles
CREATE TABLE IF NOT EXISTS profiles (
  profile_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bio TEXT,
  tags VARCHAR(255) NOT NULL,
  rythmo_band_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (rythmo_band_id) REFERENCES rythmo_bands(rythmo_band_id) ON DELETE CASCADE
);

