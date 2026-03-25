CREATE DATABASE krishi_sahayak;

CREATE DATABASE IF NOT EXISTS krishi_sahayak;
USE krishi_sahayak;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nepali_name VARCHAR(100),
    season ENUM('summer', 'winter', 'all') DEFAULT 'all',
    region VARCHAR(100),
    description TEXT,
    fertilizer_tips TEXT,
    water_requirements TEXT,
    harvest_duration VARCHAR(100),
    image_url VARCHAR(255)
);

CREATE TABLE pests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nepali_name VARCHAR(100),
    affected_crops VARCHAR(255),
    symptoms TEXT,
    treatment TEXT,
    prevention TEXT
);

CREATE TABLE chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample crops
INSERT INTO crops (name, nepali_name, season, region, description, fertilizer_tips, water_requirements, harvest_duration) VALUES
('Rice', 'धान', 'summer', 'Terai', 'Main staple crop of Nepal grown in terai and hilly regions.', 'Use DAP 100kg/ha and Urea 120kg/ha', 'Requires flooded fields during growth', '120-150 days'),
('Wheat', 'गहुँ', 'winter', 'Terai', 'Second most important cereal crop in Nepal.', 'Use DAP 100kg/ha and Urea 100kg/ha', 'Requires moderate irrigation', '100-120 days'),
('Maize', 'मकै', 'summer', 'Hill', 'Important food and feed crop grown in hilly regions.', 'Use Urea 150kg/ha and DAP 75kg/ha', 'Requires well drained soil with moderate water', '90-110 days'),
('Potato', 'आलु', 'winter', 'Hill', 'Major cash crop in hill districts of Nepal.', 'Use compost 20t/ha and DAP 150kg/ha', 'Requires moderate and regular irrigation', '75-120 days'),
('Tomato', 'टमाटर', 'all', 'All', 'Popular vegetable crop grown across Nepal.', 'Use NPK 120:60:60 kg/ha', 'Regular watering, avoid waterlogging', '60-80 days'),
('Mustard', 'तोरी', 'winter', 'Terai', 'Important oilseed crop of Nepal terai.', 'Use Urea 80kg/ha and DAP 60kg/ha', 'Requires limited irrigation', '90-110 days');

-- Insert sample pests
INSERT INTO pests (name, nepali_name, affected_crops, symptoms, treatment, prevention) VALUES
('Rice Blast', 'धानको ढुसी रोग', 'Rice', 'Diamond shaped lesions on leaves, neck rot', 'Spray Tricyclazole 75WP 0.6g/L', 'Use resistant varieties, avoid excess nitrogen'),
('Aphids', 'जुम्रा', 'Wheat, Mustard, Vegetables', 'Yellowing leaves, sticky honeydew on plants', 'Spray Imidacloprid 17.8SL 0.5ml/L', 'Use yellow sticky traps, encourage natural predators'),
('Late Blight', 'ढुसी रोग', 'Potato, Tomato', 'Dark water soaked lesions on leaves and stems', 'Spray Mancozeb 75WP 2.5g/L', 'Avoid overhead irrigation, remove infected plants'),
('Stem Borer', 'सुनतले', 'Rice, Maize', 'Dead heart in vegetative stage, white ear in reproductive stage', 'Spray Chlorpyrifos 20EC 2ml/L', 'Remove stubbles after harvest, use light traps');