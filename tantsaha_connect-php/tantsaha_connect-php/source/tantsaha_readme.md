# 🌾 Tantsaha Connect - Application Agricole pour Madagascar

## 📋 Description

**Tantsaha Connect** est une application web mobile conçue pour aider les paysans malagasy à mieux gérer leurs cultures. L'application offre:

- 🌤️ **Prévisions météorologiques** locales
- 🔔 **Alertes** pour les semis, récoltes et conditions météo
- 🌱 **Gestion des parcelles** et cultures
- 📝 **Journal d'observations** quotidiennes
- 💡 **Conseils agricoles** adaptés par culture
- 🗣️ **Interface bilingue** Malagasy/Français

## 🎯 Caractéristiques ergonomiques

- Interface simplifiée avec **icônes visuelles** (peu de texte requis)
- Navigation intuitive adaptée aux utilisateurs peu alphabétisés
- **Grandes zones tactiles** pour faciliter l'utilisation
- **Support hors ligne** (données stockées localement)
- Design adapté aux écrans de smartphones basiques
- Respect des conventions culturelles (couleurs, symboles)

## 🛠️ Installation avec WampServer

### Prérequis

- **WampServer 3.x** (inclut PHP 7.4+, MySQL, Apache)
- Navigateur web moderne (Chrome, Firefox, Edge)

### Étapes d'installation

#### 1. Installer WampServer

- Téléchargez WampServer depuis [wampserver.com](https://www.wampserver.com/)
- Installez-le (généralement dans `C:\wamp64\`)
- Lancez WampServer et attendez que l'icône devienne verte

#### 2. Copier les fichiers du projet

```
C:\wamp64\www\tantsaha_connect\
├── config.php
├── login.php
├── logout.php
├── index.php
├── meteo.php
├── alertes.php
├── parcelles.php
├── conseils.php
├── init_data.php
└── README.md
```

Copiez tous les fichiers PHP dans le dossier `C:\wamp64\www\tantsaha_connect\`

#### 3. Créer la base de données

**Option A : Via phpMyAdmin**

1. Ouvrez votre navigateur et allez à `http://localhost/phpmyadmin`
2. Cliquez sur "Nouvelle base de données"
3. Nom: `tantsaha_connect`
4. Interclassement: `utf8mb4_unicode_ci`
5. Cliquez sur "Créer"
6. Allez dans l'onglet "SQL"
7. Copiez-collez le contenu du fichier SQL fourni
8. Cliquez sur "Exécuter"

**Option B : Via ligne de commande MySQL**

```bash
# Ouvrir MySQL depuis WampServer
mysql -u root -p

# Créer la base de données
CREATE DATABASE tantsaha_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tantsaha_connect;

# Copier-coller le contenu SQL fourni
```

#### 4. Initialiser les données de test

1. Ouvrez votre navigateur
2. Allez à `http://localhost/tantsaha_connect/init_data.php`
3. Attendez la confirmation de l'initialisation

Cela créera :
- Un utilisateur de test (Téléphone: **0341234567**, Mot de passe: **1234**)
- Des prévisions météo pour 7 jours
- Une parcelle avec une culture de riz
- Plusieurs alertes
- Des observations au journal
- Des conseils agricoles

#### 5. Se connecter

1. Allez à `http://localhost/tantsaha_connect/login.php`
2. Connectez-vous avec:
   - **Téléphone**: 0341234567
   - **Mot de passe**: 1234
3. Explorez l'application! 🎉

## 📱 Fonctionnalités principales

### 🏠 Page d'accueil
- Affichage de la météo du jour
- Menu principal avec grandes icônes
- Badge de notification pour les alertes non lues

### 🌤️ Météo
- Prévisions pour aujourd'hui (détaillées)
- Prévisions 7 jours
- Température min/max, précipitations, humidité

### 🔔 Alertes
- Alertes non lues en priorité
- Filtrage par type (météo, semis, récolte, parasites)
- Badge de priorité (Faible, Moyenne, Haute)
- Marquer comme lu

### 🌱 Parcelles
- Liste des parcelles du paysan
- Ajout de nouvelles parcelles (nom, superficie, type de sol, localisation)
- Nombre de cultures actives par parcelle

### 💡 Conseils
- Conseils par catégorie (Semis, Entretien, Récolte, Parasites, Sol)
- Filtrage simple
- Support audio (prévu)
- Conseils bilingues

## 🗂️ Structure de la base de données

### Tables principales

- **PAYSAN** : Utilisateurs (paysans)
- **PARCELLE** : Parcelles de terrain
- **LOCALISATION** : Localités/Régions
- **METEO** : Prévisions météorologiques
- **PRODUIT** : Cultures agricoles (riz, manioc, etc.)
- **SAISON** : Saisons de culture
- **JOURNAL** : Observations quotidiennes
- **CONSEIL** : Conseils agricoles
- **ALERTE** : Notifications pour les paysans

## 🎨 Principes de conception IHM

L'application respecte les **heuristiques de Nielsen** :

1. **Visibilité de l'état du système** : Badges de notification, indicateurs de statut
2. **Correspondance avec le monde réel** : Icônes familières (☀️, 🌧️, 🌾)
3. **Contrôle et liberté de l'utilisateur** : Bouton retour toujours visible
4. **Cohérence et standards** : Design uniforme sur toutes les pages
5. **Prévention des erreurs** : Validation des formulaires
6. **Reconnaissance plutôt que rappel** : Navigation par icônes
7. **Flexibilité et efficacité** : Interface simple et rapide
8. **Design esthétique et minimaliste** : Pas de surcharge visuelle
9. **Aide à la récupération d'erreur** : Messages clairs en cas d'erreur
10. **Aide et documentation** : Interface intuitive sans documentation nécessaire

### Critères d'ergonomie (Bastien & Scapin)

- **Guidage** : Icônes, couleurs, disposition claire
- **Charge de travail** : Actions simples, peu d'étapes
- **Contrôle explicite** : Actions explicites, confirmations
- **Adaptabilité** : Bilingue, adapté aux niveaux d'éducation
- **Gestion des erreurs** : Messages d'erreur compréhensibles
- **Homogénéité** : Cohérence visuelle et fonctionnelle
- **Signifiance des codes** : Icônes universelles
- **Compatibilité** : Adapté au contexte rural malagasy

## 🔒 Sécurité

- Mots de passe hashés avec `password_hash()` (bcrypt)
- Protection contre les injections SQL (requêtes préparées PDO)
- Sanitization des entrées utilisateur
- Sessions sécurisées

## 🌍 Adaptation culturelle

- **Langue malagasy** en priorité
- **Icônes universelles** pour compenser l'illettrisme
- **Couleurs appropriées** (éviter le rouge seul = danger)
- **Unités locales** (hectares, millimètres)
- **Noms locaux** des cultures (Vary, Mihogo, etc.)

## 📊 Technologies utilisées

- **Backend** : PHP 7.4+
- **Base de données** : MySQL 5.7+ / MariaDB
- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Serveur** : Apache (via WampServer)

## 🐛 Dépannage

### WampServer ne démarre pas (icône orange/rouge)
- Vérifiez que les ports 80 et 3306 ne sont pas utilisés
- Désactivez Skype ou IIS s'ils utilisent le port 80
- Redémarrez tous les services WampServer

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré (icône verte)
- Vérifiez les paramètres dans `config.php`
- Mot de passe par défaut de MySQL : vide (`''`)

### Les styles ne s'affichent pas
- Videz le cache du navigateur (Ctrl+F5)
- Vérifiez les chemins des fichiers CSS/JS

### Erreur "Base de données introuvable"
- Assurez-vous d'avoir créé la base de données
- Relancez le script SQL de création

## 📝 Développements futurs

- [ ] Mode complètement hors ligne (PWA)
- [ ] Notifications push
- [ ] Support vocal complet en malagasy
- [ ] Photos des observations
- [ ] Marketplace de produits agricoles
- [ ] Géolocalisation GPS des parcelles
- [ ] Statistiques et graphiques de rendement
- [ ] Prévisions météo API réelle
- [ ] Version mobile native (Android)

## 👥 Public cible

- Paysans malagasy niveau CEPE/BEPC
- Utilisateurs de smartphones basiques
- Faible niveau d'alphabétisation
- Accès internet limité ou inexistant

## 📄 Licence

Projet éducatif - Libre d'utilisation

## 🤝 Contribution

Ce projet a été conçu selon les principes d'ergonomie et d'IHM pour répondre aux besoins spécifiques des paysans malagasy.

---

**Fait avec ❤️ pour les tantsaha malagasy** 🌾🇲🇬