-- Base de données Tantsaha Connect
CREATE DATABASE IF NOT EXISTS tantsaha_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tantsaha_connect;

-- Table PAYSAN
CREATE TABLE PAYSAN (
    id_paysan INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    niveau_education ENUM('CEPE', 'BEPC', 'Autre', 'Non scolarisé') DEFAULT 'CEPE',
    langue_preferee ENUM('Malagasy', 'Français') DEFAULT 'Malagasy',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table LOCALISATION
CREATE TABLE LOCALISATION (
    id_localisation INT PRIMARY KEY AUTO_INCREMENT,
    nom_localite VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    commune VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Table METEO
CREATE TABLE METEO (
    id_meteo INT PRIMARY KEY AUTO_INCREMENT,
    id_localisation INT NOT NULL,
    date_prevision DATE NOT NULL,
    temperature_min DECIMAL(4, 1),
    temperature_max DECIMAL(4, 1),
    precipitation_mm DECIMAL(5, 1),
    humidite_pourcent INT,
    description_temps VARCHAR(100),
    icone_meteo VARCHAR(50),
    date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_localisation) REFERENCES LOCALISATION(id_localisation) ON DELETE CASCADE
);

-- Table PRODUIT (cultures agricoles)
CREATE TABLE PRODUIT (
    id_produit INT PRIMARY KEY AUTO_INCREMENT,
    nom_produit VARCHAR(100) NOT NULL,
    nom_malagasy VARCHAR(100),
    type_culture ENUM('Céréale', 'Légume', 'Fruit', 'Tubercule', 'Autre') NOT NULL,
    duree_culture_jours INT,
    saison_recommandee VARCHAR(100),
    icone VARCHAR(50)
);

-- Table PARCELLE
CREATE TABLE PARCELLE (
    id_parcelle INT PRIMARY KEY AUTO_INCREMENT,
    id_paysan INT NOT NULL,
    id_localisation INT NOT NULL,
    nom_parcelle VARCHAR(100) NOT NULL,
    superficie_ha DECIMAL(6, 2),
    type_sol VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE,
    FOREIGN KEY (id_localisation) REFERENCES LOCALISATION(id_localisation) ON DELETE SET NULL
);

-- Table SAISON
CREATE TABLE SAISON (
    id_saison INT PRIMARY KEY AUTO_INCREMENT,
    id_parcelle INT NOT NULL,
    id_produit INT NOT NULL,
    date_semis DATE NOT NULL,
    date_recolte_prevue DATE,
    date_recolte_reelle DATE,
    quantite_recoltee DECIMAL(8, 2),
    unite_mesure VARCHAR(20),
    statut ENUM('En cours', 'Récolté', 'Abandonné') DEFAULT 'En cours',
    FOREIGN KEY (id_parcelle) REFERENCES PARCELLE(id_parcelle) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES PRODUIT(id_produit) ON DELETE CASCADE
);

-- Table JOURNAL (observations quotidiennes)
CREATE TABLE JOURNAL (
    id_journal INT PRIMARY KEY AUTO_INCREMENT,
    id_saison INT NOT NULL,
    date_observation DATE NOT NULL,
    type_observation ENUM('Pluie', 'Parasites', 'Maladie', 'Croissance', 'Autre') NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_saison) REFERENCES SAISON(id_saison) ON DELETE CASCADE
);

-- Table CONSEIL
CREATE TABLE CONSEIL (
    id_conseil INT PRIMARY KEY AUTO_INCREMENT,
    id_produit INT,
    titre VARCHAR(200) NOT NULL,
    titre_malagasy VARCHAR(200),
    contenu TEXT NOT NULL,
    contenu_malagasy TEXT,
    categorie ENUM('Semis', 'Entretien', 'Récolte', 'Lutte parasites', 'Sol', 'Autre') NOT NULL,
    audio_url VARCHAR(255),
    icone VARCHAR(50),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produit) REFERENCES PRODUIT(id_produit) ON DELETE SET NULL
);

-- Table ALERTE
CREATE TABLE ALERTE (
    id_alerte INT PRIMARY KEY AUTO_INCREMENT,
    id_paysan INT NOT NULL,
    id_saison INT,
    type_alerte ENUM('Météo', 'Semis', 'Récolte', 'Parasite', 'Conseil') NOT NULL,
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priorite ENUM('Faible', 'Moyenne', 'Haute') DEFAULT 'Moyenne',
    date_alerte DATE NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE,
    FOREIGN KEY (id_saison) REFERENCES SAISON(id_saison) ON DELETE SET NULL
);

-- Table associative PAYSAN_CONSEIL (conseils favoris)
CREATE TABLE PAYSAN_CONSEIL (
    id_paysan INT NOT NULL,
    id_conseil INT NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_paysan, id_conseil),
    FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE,
    FOREIGN KEY (id_conseil) REFERENCES CONSEIL(id_conseil) ON DELETE CASCADE
);

-- Données de test
INSERT INTO LOCALISATION (nom_localite, region, district, latitude, longitude) VALUES
('Antananarivo', 'Analamanga', 'Antananarivo Renivohitra', -18.8792, 47.5079),
('Antsirabe', 'Vakinankaratra', 'Antsirabe I', -19.8658, 47.0353),
('Fianarantsoa', 'Haute Matsiatra', 'Fianarantsoa I', -21.4533, 47.0861);

INSERT INTO PRODUIT (nom_produit, nom_malagasy, type_culture, duree_culture_jours, saison_recommandee, icone) VALUES
('Riz', 'Vary', 'Céréale', 120, 'Novembre-Mars', '🌾'),
('Manioc', 'Mihogo', 'Tubercule', 240, 'Octobre-Décembre', '🥔'),
('Haricot', 'Tsaramaso', 'Légume', 90, 'Octobre-Mars', '🫘'),
('Tomate', 'Voatabia', 'Légume', 75, 'Mars-Septembre', '🍅'),
('Maïs', 'Katsaka', 'Céréale', 100, 'Octobre-Janvier', '🌽');

INSERT INTO CONSEIL (id_produit, titre, titre_malagasy, contenu, contenu_malagasy, categorie, icone) VALUES
(1, 'Préparation du sol pour le riz', 'Fanomanana ny tany ho an\'ny vary', 'Labourer le sol 2 semaines avant le semis. Bien niveler pour retenir l\'eau.', 'Asao mialoha 2 herinandro ny tany. Ravahy tsara mba hitehirizana rano.', 'Semis', '🌾'),
(3, 'Lutte contre les pucerons', 'Fiadiana amin\'ny kankana', 'Utiliser du savon noir dilué ou des plantes répulsives comme l\'ail.', 'Ampiasao savony mainty na zava-maniry toy ny tongolo gasy.', 'Lutte parasites', '🐛'),
(2, 'Récolte du manioc', 'Fijinjana ny mihogo', 'Récolter 8-12 mois après plantation. Vérifier la taille des tubercules.', 'Jinjao aorian\'ny 8-12 volana. Jereo ny haben\'ny mihogo.', 'Récolte', '🥔');