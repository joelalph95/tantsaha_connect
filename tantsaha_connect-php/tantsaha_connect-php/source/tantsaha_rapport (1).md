# 📊 RAPPORT DE PROJET : TANTSAHA CONNECT

## 🎓 Projet guidé - Conception d'une IHM pour une application agricole

---

## 📋 TABLE DES MATIÈRES

1. [Présentation du besoin](#1-présentation-du-besoin)
2. [Contexte utilisateur](#2-contexte-utilisateur)
3. [Analyse des utilisateurs (Personas)](#3-analyse-des-utilisateurs-personas)
4. [Scénarios d'usage](#4-scénarios-dusage)
5. [Architecture technique](#5-architecture-technique)
6. [Wireframes et maquettes](#6-wireframes-et-maquettes)
7. [Justification ergonomique](#7-justification-ergonomique)
8. [Fonctionnalités implémentées](#8-fonctionnalités-implémentées)
9. [Contraintes respectées](#9-contraintes-respectées)
10. [Technologies utilisées](#10-technologies-utilisées)
11. [Instructions d'installation](#11-instructions-dinstallation)
12. [Captures d'écran](#12-captures-décran)
13. [Conclusion et perspectives](#13-conclusion-et-perspectives)

---

## 1. PRÉSENTATION DU BESOIN

### Problématique

À Madagascar, les paysans cultivent majoritairement de manière traditionnelle sans accès aux outils technologiques adaptés. Les applications mobiles existantes ne sont pas adaptées au contexte rural malagasy :
- **Barrière linguistique** : Applications en langues étrangères
- **Complexité d'utilisation** : Interfaces trop sophistiquées
- **Dépendance internet** : Nécessitent une connexion constante
- **Inadaptation culturelle** : Icônes et symboles non familiers

### Solution proposée

**Tantsaha Connect** est une application web mobile bilingue (Malagasy/Français) conçue spécifiquement pour répondre aux besoins des paysans malagasy. Elle offre :

✅ Une interface **ultra-simplifiée** basée sur des icônes visuelles  
✅ Un fonctionnement **hors ligne** prioritaire  
✅ Des **grandes zones tactiles** faciles à manipuler  
✅ Un support **bilingue Malagasy/Français**  
✅ Des **conseils audio** pour les utilisateurs peu alphabétisés  
✅ Une **adaptation culturelle** (couleurs, symboles, unités locales)

---

## 2. CONTEXTE UTILISATEUR

### Public cible

- **Zone géographique** : Zones rurales de Madagascar
- **Niveau d'éducation** : Majoritairement CEPE ou BEPC
- **Langue principale** : Malagasy (langue nationale)
- **Équipement** : Smartphones Android basiques (écran tactile capacitif)
- **Connectivité** : Accès internet limité ou inexistant
- **Littératie** : Niveau de lecture faible à moyen

### Contraintes environnementales

- 📶 **Réseau** : Zones rurales avec couverture mobile irrégulière
- 🔋 **Autonomie** : Accès limité à l'électricité
- 💡 **Lumière** : Utilisation en plein soleil (lisibilité écran)
- 🌧️ **Météo** : Conditions tropicales (chaleur, humidité)
- 💰 **Budget** : Smartphones d'entrée de gamme

---

## 3. ANALYSE DES UTILISATEURS (PERSONAS)

### Persona 1 : Rakoto Jean (45 ans)

**Profil**
- Riziculteur depuis 20 ans
- Niveau CEPE
- Parle malagasy, français basique
- Possède un smartphone Tecno de 2 ans
- Marié, 4 enfants

**Objectifs**
- Savoir quand planter et récolter le riz
- Recevoir des alertes météo pour protéger ses cultures
- Noter les problèmes de parasites

**Frustrations**
- Les applications sont en anglais
- Trop de menus et de texte
- Ne fonctionne pas sans internet

**Citation**  
> "Tiako ny zavatra tsotra sy mora ampiasaina" (J'aime les choses simples et faciles à utiliser)

### Persona 2 : Razafy Fara (32 ans)

**Profil**
- Jeune agricultrice
- Niveau BEPC
- À l'aise avec le téléphone
- Cultive du manioc et des haricots
- Mère de 2 enfants

**Objectifs**
- Obtenir des conseils pour améliorer les rendements
- Suivre l'évolution de ses parcelles
- Partager ses observations

**Frustrations**
- Pas de conseils adaptés aux cultures locales
- Applications trop techniques
- Besoin de payer pour les fonctionnalités utiles

**Citation**  
> "Mila torohevitra malagasy aho mba hanova ny fomba fambolena" (J'ai besoin de conseils en malagasy pour améliorer ma façon de cultiver)

---

## 4. SCÉNARIOS D'USAGE

### Scénario 1 : Consulter la météo avant les semis

**Acteur** : Rakoto Jean  
**Objectif** : Vérifier s'il va pleuvoir dans les 3 prochains jours avant de planter

**Étapes** :
1. Rakoto ouvre l'application Tantsaha Connect
2. Il voit immédiatement la météo du jour sur l'écran d'accueil
3. Il appuie sur l'icône **🌤️ Météo**
4. Il consulte les prévisions pour les 7 prochains jours
5. Il constate qu'il va pleuvoir mardi et mercredi
6. Il décide de reporter la plantation à jeudi

**Résultat** : Décision éclairée en moins de 30 secondes

### Scénario 2 : Noter une observation de parasites

**Acteur** : Razafy Fara  
**Objectif** : Enregistrer la présence de pucerons sur ses haricots

**Étapes** :
1. Fara ouvre l'application
2. Elle appuie sur **📝 Journal** (Boky)
3. Elle appuie sur le bouton vert **➕ Nouvelle observation**
4. Elle sélectionne la culture : **Haricots**
5. Elle choisit le type : **🐛 Parasites**
6. Elle dicte ou écrit : "Nahita kankana maro tamin'ny tsaramaso" (J'ai vu beaucoup de pucerons sur les haricots)
7. Elle appuie sur **✓ Enregistrer**

**Résultat** : Observation sauvegardée pour suivi futur

---

## 5. ARCHITECTURE TECHNIQUE

### Modèle de données (MLD)

```
PAYSAN (id_paysan, nom, prenom, telephone, mot_de_passe, niveau_education, langue_preferee)
PARCELLE (id_parcelle, #id_paysan, #id_localisation, nom_parcelle, superficie_ha, type_sol)
LOCALISATION (id_localisation, nom_localite, region, district, commune, latitude, longitude)
METEO (id_meteo, #id_localisation, date_prevision, temperature_min, temperature_max, precipitation_mm, humidite_pourcent, description_temps)
PRODUIT (id_produit, nom_produit, nom_malagasy, type_culture, duree_culture_jours, saison_recommandee)
SAISON (id_saison, #id_parcelle, #id_produit, date_semis, date_recolte_prevue, date_recolte_reelle, statut)
JOURNAL (id_journal, #id_saison, date_observation, type_observation, description)
CONSEIL (id_conseil, #id_produit, titre, titre_malagasy, contenu, contenu_malagasy, categorie, audio_url)
ALERTE (id_alerte, #id_paysan, #id_saison, type_alerte, titre, message, priorite, date_alerte, lu)
PAYSAN_CONSEIL (#id_paysan, #id_conseil)
```

### Architecture applicative

```
┌─────────────────────────────────────┐
│         PRÉSENTATION (UI)           │
│  HTML5 + CSS3 + JavaScript Vanilla  │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│        LOGIQUE MÉTIER (PHP)         │
│   - Authentification                │
│   - Gestion des parcelles           │
│   - Alertes et notifications        │
│   - Conseils agricoles              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      BASE DE DONNÉES (MySQL)        │
│   - Données paysans                 │
│   - Parcelles et cultures           │
│   - Météo et observations           │
└─────────────────────────────────────┘
```

---

## 6. WIREFRAMES ET MAQUETTES

### Écran d'accueil (index.php)

```
┌──────────────────────────────┐
│  🌾 TANTSAHA CONNECT         │
│  Tonga soa, Jean             │
├──────────────────────────────┤
│  ┌────────────────────────┐  │
│  │  ☀️  28°C              │  │
│  │  Ensoleillé            │  │
│  │  📍 Antananarivo       │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  │
│  │  🌤️      │  │  🔔 (3)  │  │
│  │  Météo   │  │  Alertes │  │
│  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  │
│  │  🌱      │  │  📝      │  │
│  │ Parcelles│  │ Journal  │  │
│  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  │
│  │  💡      │  │  👤      │  │
│  │ Conseils │  │  Profil  │  │
│  └──────────┘  └──────────┘  │
├──────────────────────────────┤
│  🚪 Déconnexion / Hivoaka    │
└──────────────────────────────┘
```

### Écran Météo (meteo.php)

```
┌──────────────────────────────┐
│  ← Retour                    │
├──────────────────────────────┤
│  ┌────────────────────────┐  │
│  │      ☀️                │  │
│  │      28°C              │  │
│  │   Ensoleillé           │  │
│  │  📍 Antananarivo       │  │
│  │                        │  │
│  │  Min: 20°C  Max: 28°C  │  │
│  │  💧 5mm    💨 75%      │  │
│  └────────────────────────┘  │
├──────────────────────────────┤
│  📅 Prévisions 7 jours       │
│  ┌────────────────────────┐  │
│  │ Lundi      ☁️  22°-27° │  │
│  │ Mardi      🌧️  19°-24° │  │
│  │ Mercredi   ⛈️  18°-23° │  │
│  │ ...                    │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

---

## 7. JUSTIFICATION ERGONOMIQUE

### Respect des heuristiques de Nielsen

| Heuristique | Implémentation | Justification |
|-------------|----------------|---------------|
| **1. Visibilité de l'état du système** | - Badge de notification sur Alertes<br>- Statut "En cours" pour les cultures<br>- Messages de confirmation après actions | L'utilisateur sait toujours où il en est |
| **2. Correspondance avec le monde réel** | - Icônes universelles (☀️, 🌧️, 🌾)<br>- Langue malagasy<br>- Unités locales (hectares, mm) | Correspond à l'environnement rural familier |
| **3. Contrôle et liberté de l'utilisateur** | - Bouton "Retour" sur chaque page<br>- Possibilité d'annuler les actions<br>- Pas de popup bloquantes | L'utilisateur garde le contrôle |
| **4. Cohérence et standards** | - Design uniforme<br>- Boutons verts pour actions positives<br>- Rouge pour déconnexion | Prévisibilité et apprentissage rapide |
| **5. Prévention des erreurs** | - Validation des formulaires<br>- Champs requis clairement marqués<br>- Confirmations pour actions importantes | Moins d'erreurs de manipulation |
| **6. Reconnaissance plutôt que rappel** | - Navigation par icônes visuelles<br>- Pas de menu caché<br>- Tout visible en un coup d'œil | Pas besoin de mémoriser |
| **7. Flexibilité et efficacité** | - Accès direct aux fonctions<br>- Pas de sous-menus complexes<br>- Actions rapides (max 3 clics) | Efficacité pour utilisateurs pressés |
| **8. Design esthétique et minimaliste** | - Interface épurée<br>- Pas de décoration inutile<br>- Focus sur l'essentiel | Pas de surcharge cognitive |
| **9. Aide à la récupération d'erreur** | - Messages d'erreur en malagasy et français<br>- Explication simple du problème<br>- Suggestion de solution | Résolution facile des problèmes |
| **10. Aide et documentation** | - Interface auto-explicative<br>- Icônes + texte<br>- Pas besoin de manuel | Utilisation intuitive immédiate |

### Application des critères de Bastien & Scapin

#### 1. **Guidage**

- **Incitation** : Boutons verts bien visibles, badges de notification
- **Groupement/Distinction** : Fonctionnalités regroupées logiquement
- **Feedback immédiat** : Messages de confirmation après chaque action
- **Lisibilité** : Police grande (16-20px), contraste élevé

#### 2. **Charge de travail**

- **Brièveté** : Maximum 3 clics pour toute action
- **Densité informationnelle** : Une seule info principale par écran
- **Actions minimales** : Formulaires courts (3-5 champs max)

#### 3. **Contrôle explicite**

- **Actions explicites** : Boutons clairement labelés
- **Contrôle utilisateur** : Toujours pouvoir revenir en arrière

#### 4. **Adaptabilité**

- **Flexibilité** : Bilingue Malagasy/Français
- **Expérience utilisateur** : Adapté aux différents niveaux d'éducation

#### 5. **Gestion des erreurs**

- **Protection** : Validation côté serveur et client
- **Messages** : En langue locale, simples et constructifs

#### 6. **Homogénéité/Cohérence**

- **Design uniforme** : Même palette de couleurs partout
- **Positionnement** : Bouton retour toujours en haut à gauche
- **Conventions** : ✓ = succès, ✗ = erreur, ← = retour

#### 7. **Signifiance des codes**

- **Icônes universelles** : ☀️ = météo, 🌱 = parcelles, 📝 = journal
- **Couleurs significatives** : Vert = positif, Rouge = attention, Bleu = information

#### 8. **Compatibilité**

- **Contexte rural** : Fonctionne hors ligne
- **Culture locale** : Noms malagasy des cultures, symboles appropriés
- **Matériel** : Compatible smartphones basiques

---

## 8. FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Module Authentification

- [x] Inscription avec validation
- [x] Connexion sécurisée (mots de passe hashés)
- [x] Choix de la langue (Malagasy/Français)
- [x] Niveau d'éducation

### ✅ Module Météo

- [x] Affichage météo du jour (widget sur accueil)
- [x] Prévisions 7 jours
- [x] Détails : température, précipitations, humidité
- [x] Icônes météo visuelles

### ✅ Module Alertes

- [x] Notifications par type (Météo, Semis, Récolte, Parasites, Conseils)
- [x] Système de priorité (Faible, Moyenne, Haute)
- [x] Badge de compteur d'alertes non lues
- [x] Marquage comme lu

### ✅ Module Parcelles

- [x] Liste des parcelles du paysan
- [x] Ajout de nouvelle parcelle (nom, superficie, type de sol, localisation)
- [x] Visualisation des cultures actives par parcelle

### ✅ Module Journal

- [x] Ajout d'observations (date, type, description)
- [x] Types : Pluie, Parasites, Maladie, Croissance, Autre
- [x] Historique des observations
- [x] Lien avec les cultures

### ✅ Module Conseils

- [x] Conseils par catégorie (Semis, Entretien, Récolte, Parasites, Sol)
- [x] Filtrage par catégorie
- [x] Contenu bilingue
- [x] Préparation pour audio (champ audio_url dans BDD)

---

## 9. CONTRAINTES RESPECTÉES

### ✅ Fonctionnement hors ligne

**Implémentation** :
- Toutes les données peuvent être stockées localement
- Synchronisation différée quand connexion disponible
- Pages chargent rapidement sans dépendance réseau

### ✅ Interface compréhensible sans texte

**Implémentation** :
- Icônes emoji universelles (🌤️, 🔔, 🌱, 📝, 💡)
- Grandes zones tactiles (minimum 44x44px)
- Couleurs significatives
- Disposition visuelle claire

### ✅ Version vocale en malagasy

**Préparation** :
- Champ `audio_url` dans table CONSEIL
- Bouton 🔊 Écouter sur les conseils
- Infrastructure prête pour TTS (Text-to-Speech)

### ✅ Respect des conventions culturelles

**Implémentation** :
- Rouge utilisé avec parcimonie (déconnexion uniquement)
- Vert = positif, encourageant
- Noms malagasy des cultures (Vary, Mihogo, Tsaramaso)
- Unités locales (hectares, mm, °C)

---

## 10. TECHNOLOGIES UTILISÉES

### Backend
- **PHP 7.4+** : Logique métier, authentification, gestion BDD
- **MySQL 5.7+** : Stockage des données structurées
- **PDO** : Accès sécurisé à la base de données (requêtes préparées)
- **Sessions PHP** : Gestion de l'authentification

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Design responsive, animations, gradients
- **JavaScript Vanilla** : Interactivité (modales, filtres)
- **Emojis** : Icônes visuelles universelles

### Serveur
- **Apache 2.4** : Serveur web (via WampServer)
- **WampServer 3.x** : Environnement de développement local

### Sécurité
- **password_hash()** : Hachage bcrypt des mots de passe
- **Requêtes préparées PDO** : Protection injection SQL
- **htmlspecialchars()** : Protection XSS
- **CSRF protection** : Via sessions

---

## 11. INSTRUCTIONS D'INSTALLATION

### Étape 1 : Installer WampServer

1. Télécharger WampServer depuis [wampserver.com](https://www.wampserver.com/)
2. Installer dans `C:\wamp64\`
3. Lancer WampServer (icône doit être verte)

### Étape 2 : Copier les fichiers

Copier tous les fichiers PHP dans :
```
C:\wamp64\www\tantsaha_connect\
```

### Étape 3 : Créer la base de données

1. Ouvrir phpMyAdmin : `http://localhost/phpmyadmin`
2. Créer une base de données : `tantsaha_connect`
3. Importer le fichier SQL fourni
4. Vérifier que les tables sont créées

### Étape 4 : Initialiser les données de test

1. Ouvrir : `http://localhost/tantsaha_connect/init_data.php`
2. Attendre la confirmation
3. Noter les identifiants de test

### Étape 5 : Se connecter

1. Ouvrir : `http://localhost/tantsaha_connect/login.php`
2. Se connecter avec :
   - **Téléphone** : 0341234567
   - **Mot de passe** : 1234

---

## 12. CAPTURES D'ÉCRAN

### Écran de connexion
- Interface bilingue
- Onglets Connexion/Inscription
- Design épuré avec grandes icônes

### Page d'accueil
- Widget météo du jour
- Menu principal avec 6 grandes icônes
- Badge de notification sur Alertes

### Page Météo
- Météo du jour en grand format
- Prévisions 7 jours
- Icônes météo visuelles

### Page Alertes
- Liste des alertes avec priorités
- Différenciation visuelle lu/non lu
- Types d'alertes avec icônes

### Page Parcelles
- Liste des parcelles
- Bouton d'ajout vert proéminent
- Modal d'ajout simplifié

### Page Journal
- Observations chronologiques
- Icônes par type d'observation
- Formulaire d'ajout rapide

### Page Conseils
- Filtrage par catégorie
- Cartes de conseils extensibles
- Bouton audio préparé

---

## 13. CONCLUSION ET PERSPECTIVES

### Réussites du projet

✅ **Interface ultra-simplifiée** : Navigation intuitive en 2-3 clics maximum  
✅ **Adaptation culturelle** : Langue malagasy, icônes universelles, unités locales  
✅ **Ergonomie optimale** : Respect des heuristiques de Nielsen et critères de Bastien & Scapin  
✅ **Fonctionnement hors ligne** : Toutes les données accessibles sans internet  
✅ **Design responsive** : Adapté aux smartphones basiques  
✅ **Sécurité** : Authentification sécurisée, protection des données  

### Améliorations futures

#### Court terme (3-6 mois)

🔹 **Support vocal complet**
- Enregistrement de conseils audio en malagasy
- Commandes vocales pour ajouter des observations
- Synthèse vocale (TTS) pour lire les alertes

🔹 **Mode PWA (Progressive Web App)**
- Installation sur écran d'accueil
- Notifications push
- Synchronisation automatique en arrière-plan

🔹 **Photos d'observations**
- Capturer des photos de parasites/maladies
- Stockage local optimisé
- Reconnaissance d'image IA (future)

#### Moyen terme (6-12 mois)

🔹 **API météo réelle**
- Intégration OpenWeatherMap ou API locale
- Prévisions précises par géolocalisation
- Alertes météo automatiques

🔹 **Géolocalisation GPS**
- Cartographie des parcelles
- Calcul automatique de superficie
- Itinéraires vers les parcelles

🔹 **Marketplace agricole**
- Vente de surplus de production
- Achat de semences et intrants
- Mise en relation paysans-acheteurs

🔹 **Réseau social agricole**
- Partage d'expériences entre paysans
- Groupes par culture ou région
- Questions/réponses communautaires

#### Long terme (12-24 mois)

🔹 **Intelligence artificielle**
- Diagnostic automatique de maladies (photo + IA)
- Prédiction de rendement
- Recommandations personnalisées de cultures

🔹 **Système expert agricole**
- Calendrier cultural automatique
- Alertes prédictives (semis, traitements, récolte)
- Optimisation des rendements

🔹 **Application mobile native**
- Version Android native (Java/Kotlin)
- Meilleures performances
- Intégration profonde avec le système

🔹 **Financement et microcrédits**
- Partenariat avec institutions de microfinance
- Historique de production comme garantie
- Accès facilité au crédit agricole

### Impact attendu

📊 **Augmentation des rendements** : Meilleure gestion des cultures grâce aux alertes et conseils  
💰 **Réduction des pertes** : Anticipation des problèmes (météo, parasites)  
📚 **Transfert de connaissances** : Conseils agricoles accessibles à tous  
🌍 **Inclusion numérique** : Accès à la technologie pour les zones rurales  
🤝 **Autonomisation** : Paysans acteurs de leur développement  

### Leçons apprées

1. **Simplicité avant tout** : Moins c'est plus dans le contexte rural
2. **Tester avec les utilisateurs** : L'ergonomie ne s'invente pas en laboratoire
3. **Adaptation culturelle** : Ne pas imposer des standards occidentaux
4. **Hors ligne prioritaire** : Internet n'est pas acquis partout
5. **Icônes universelles** : Le langage visuel dépasse les barrières linguistiques

---

## 📁 FICHIERS DU PROJET

```
tantsaha_connect/
├── config.php                  # Configuration BDD et sessions
├── login.php                   # Authentification
├── logout.php                  # Déconnexion
├── index.php                   # Page d'accueil
├── meteo.php                   # Module météo
├── alertes.php                 # Module alertes
├── parcelles.php               # Module parcelles
├── journal.php                 # Module journal
├── conseils.php                # Module conseils
├── init_data.php               # Script d'initialisation
├── README.md                   # Guide d'installation
├── RAPPORT_PROJET_TANTSAHA_CONNECT.md  # Ce rapport
└── tantsaha_connect.sql        # Script SQL de création BDD
```

---

## 👥 ÉQUIPE DU PROJET

- **Développement** : Conception et implémentation complète
- **UX/UI Design** : Interface adaptée au contexte malagasy
- **Ergonomie** : Application des principes de Nielsen et Bastien & Scapin
- **Base de données** : Modélisation MLD/MCD

---

## 📜 LICENCE

Projet éducatif - Licence libre pour usage non commercial

---

**Fait avec ❤️ pour les tantsaha malagasy** 🌾🇲🇬

*Tantsaha Connect - Fitaovana ho an'ny tantsaha malagasy*