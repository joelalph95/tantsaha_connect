# 🚀 GUIDE DE DÉMARRAGE RAPIDE - TANTSAHA CONNECT

## ⚡ Installation en 5 minutes

### ✅ Étape 1 : Installer WampServer (si pas déjà installé)

1. **Télécharger** WampServer : [wampserver.com](https://www.wampserver.com/)
2. **Installer** en suivant l'assistant
3. **Lancer** WampServer
4. **Attendre** que l'icône devienne **VERTE** 🟢

```
❌ Rouge = Arrêté
🟠 Orange = Démarrage
🟢 Vert = Prêt!
```

---

### ✅ Étape 2 : Copier les fichiers

**Copiez tous les fichiers PHP** dans ce dossier :

```
C:\wamp64\www\tantsaha_connect\
```

📁 **Liste des fichiers nécessaires** :
- ✅ config.php
- ✅ login.php
- ✅ logout.php
- ✅ index.php
- ✅ meteo.php
- ✅ alertes.php
- ✅ parcelles.php
- ✅ journal.php
- ✅ conseils.php
- ✅ profil.php
- ✅ init_data.php

---

### ✅ Étape 3 : Créer la base de données

**Option A : Via phpMyAdmin** (recommandé pour débutants)

1. Ouvrez votre navigateur
2. Allez à : `http://localhost/phpmyadmin`
3. Cliquez sur **"Nouvelle base de données"**
4. Nom : `tantsaha_connect`
5. Interclassement : `utf8mb4_unicode_ci`
6. Cliquez **"Créer"**
7. Cliquez sur l'onglet **"SQL"**
8. Copiez-collez **TOUT** le contenu du fichier SQL fourni
9. Cliquez **"Exécuter"**
10. Vérifiez que les **10 tables** sont créées ✓

**Option B : Via ligne de commande MySQL**

```bash
# Ouvrir MySQL
mysql -u root -p

# (Laisser vide si pas de mot de passe)

# Créer la base
CREATE DATABASE tantsaha_connect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Utiliser la base
USE tantsaha_connect;

# Copier-coller le contenu SQL et appuyer sur Entrée
```

---

### ✅ Étape 4 : Initialiser les données de test

1. Ouvrez votre navigateur
2. Allez à : `http://localhost/tantsaha_connect/init_data.php`
3. Attendez le message de confirmation ✅
4. Notez les **identifiants de test**

---

### ✅ Étape 5 : Se connecter !

1. Allez à : `http://localhost/tantsaha_connect/login.php`
2. Connectez-vous avec :

```
📱 Téléphone : 0341234567
🔒 Mot de passe : 1234
```

3. **C'EST PARTI!** 🎉

---

## 📱 FONCTIONNALITÉS À TESTER

### 🏠 Page d'accueil
- ✅ Voir la météo du jour
- ✅ Compter les alertes (badge rouge)
- ✅ Naviguer avec les grandes icônes

### 🌤️ Météo
- ✅ Consulter les prévisions 7 jours
- ✅ Voir température, pluie, humidité
- ✅ Observer les icônes météo

### 🔔 Alertes
- ✅ Voir les 3 alertes de test
- ✅ Marquer une alerte comme "lue"
- ✅ Observer les priorités (couleurs)

### 🌱 Parcelles
- ✅ Voir la parcelle de test
- ✅ Cliquer sur "➕ Ajouter une parcelle"
- ✅ Remplir le formulaire
- ✅ Voir les cultures actives

### 📝 Journal
- ✅ Voir les 3 observations de test
- ✅ Cliquer sur "➕ Nouvelle observation"
- ✅ Choisir une culture
- ✅ Sélectionner un type (Pluie, Parasites, etc.)
- ✅ Écrire une description
- ✅ Enregistrer

### 💡 Conseils
- ✅ Filtrer par catégorie (Semis, Entretien, etc.)
- ✅ Cliquer "Lire plus" pour voir le contenu complet
- ✅ Observer les conseils bilingues

### 👤 Profil
- ✅ Voir les statistiques
- ✅ Modifier nom/prénom
- ✅ Changer la langue
- ✅ Changer le mot de passe

---

## 🎯 SCÉNARIO DE TEST COMPLET

### Test 1 : Ajouter une nouvelle parcelle

1. **Page d'accueil** → Cliquer **🌱 Parcelles**
2. Cliquer **➕ Ajouter une parcelle**
3. Remplir :
   - **Nom** : "Tanimboly faharoa"
   - **Superficie** : 1.5 ha
   - **Type de sol** : Sableux
   - **Localisation** : Antananarivo
4. Cliquer **✓ Enregistrer**
5. ✅ **Résultat** : Nouvelle parcelle visible

### Test 2 : Noter une observation

1. **Page d'accueil** → Cliquer **📝 Journal**
2. Cliquer **➕ Nouvelle observation**
3. Remplir :
   - **Culture** : Riz
   - **Date** : Aujourd'hui
   - **Type** : 🌱 Croissance
   - **Description** : "Ny zavamaniry dia tsara"
4. Cliquer **✓ Enregistrer**
5. ✅ **Résultat** : Observation dans la liste

### Test 3 : Changer la langue

1. **Page d'accueil** → Cliquer **👤 Profil**
2. Dans **"Modifier le profil"**
3. Changer **Langue** : Français
4. Cliquer **✓ Enregistrer**
5. ✅ **Résultat** : Interface en français

---

## 🐛 PROBLÈMES COURANTS & SOLUTIONS

### ❌ Problème : "Base de données introuvable"

**Solution** :
1. Vérifiez que MySQL est démarré (icône WampServer verte)
2. Vérifiez que la base `tantsaha_connect` existe dans phpMyAdmin
3. Vérifiez `config.php` :
   ```php
   define('DB_NAME', 'tantsaha_connect');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

### ❌ Problème : "Page blanche"

**Solution** :
1. Activez l'affichage des erreurs PHP :
   - WampServer → PHP → php.ini
   - Cherchez `display_errors = Off`
   - Changez en `display_errors = On`
2. Redémarrez WampServer
3. Rechargez la page

### ❌ Problème : "Cannot modify header information"

**Solution** :
- Vérifiez qu'il n'y a **AUCUN ESPACE** avant `<?php` dans les fichiers PHP
- Sauvegardez les fichiers en **UTF-8 sans BOM**

### ❌ Problème : WampServer reste orange

**Solution** :
1. Vérifiez que le **port 80** n'est pas utilisé :
   - Fermez Skype
   - Désactivez IIS si installé
2. Ou changez le port d'Apache :
   - WampServer → Apache → httpd.conf
   - Cherchez `Listen 80`
   - Changez en `Listen 8080`

### ❌ Problème : "Access denied for user 'root'"

**Solution** :
1. Ouvrez phpMyAdmin
2. Allez dans **Comptes utilisateurs**
3. Vérifiez que l'utilisateur `root` existe
4. Si mot de passe défini, mettez-le dans `config.php` :
   ```php
   define('DB_PASS', 'votre_mot_de_passe');
   ```

---

## 📊 VÉRIFICATION DE L'INSTALLATION

### ✅ Checklist finale

- [ ] WampServer icône **VERTE** 🟢
- [ ] Base de données `tantsaha_connect` créée
- [ ] **10 tables** visibles dans phpMyAdmin
- [ ] Page login accessible : `http://localhost/tantsaha_connect/login.php`
- [ ] Connexion réussie avec `0341234567` / `1234`
- [ ] Page d'accueil affichée avec météo
- [ ] Menu principal avec 6 icônes
- [ ] Badge "3" visible sur Alertes

### ✅ Si TOUT est coché : **INSTALLATION RÉUSSIE!** 🎉

---

## 🎓 POUR ALLER PLUS LOIN

### Créer un nouvel utilisateur

1. Allez sur la page de **Connexion**
2. Cliquez sur l'onglet **✍️ Inscription**
3. Remplissez le formulaire
4. Connectez-vous avec vos nouveaux identifiants

### Ajouter des données météo

1. Ouvrez phpMyAdmin
2. Allez dans la table `METEO`
3. Cliquez **Insérer**
4. Remplissez :
   - `id_localisation` : 1 (Antananarivo)
   - `date_prevision` : 2025-11-30
   - `temperature_min` : 18
   - `temperature_max` : 27
   - `precipitation_mm` : 10
   - `humidite_pourcent` : 75
   - `description_temps` : "Partiellement nuageux"

### Ajouter un nouveau conseil

1. Ouvrez phpMyAdmin
2. Allez dans la table `CONSEIL`
3. Cliquez **Insérer**
4. Remplissez les champs
5. Le conseil apparaîtra dans l'application

---

## 📞 SUPPORT

### Documentation complète
- **README.md** : Guide d'installation détaillé
- **RAPPORT_PROJET_TANTSAHA_CONNECT.md** : Documentation technique complète

### Structure des fichiers
```
tantsaha_connect/
├── 📄 config.php              → Configuration
├── 🔐 login.php               → Page de connexion
├── 🏠 index.php               → Page d'accueil
├── 🌤️ meteo.php              → Module météo
├── 🔔 alertes.php             → Module alertes
├── 🌱 parcelles.php           → Module parcelles
├── 📝 journal.php             → Module journal
├── 💡 conseils.php            → Module conseils
├── 👤 profil.php              → Module profil
├── 🔧 init_data.php           → Script d'initialisation
└── 📚 README.md               → Documentation
```

---

## 🎯 OBJECTIFS PÉDAGOGIQUES ATTEINTS

✅ **Analyse du contexte utilisateur** : Personas définis  
✅ **Heuristiques de Nielsen** : 10/10 appliquées  
✅ **Critères ergonomiques** : Bastien & Scapin respectés  
✅ **Interface adaptée** : Icônes, bilingue, tactile  
✅ **Prototype fonctionnel** : Application complète  
✅ **Contraintes respectées** : Hors ligne, simple, culturel  

---

**Fait avec ❤️ pour les tantsaha malagasy** 🌾🇲🇬

---

## 🏁 PRÊT À DÉMARRER ?

### 👉 Suivez les 5 étapes ci-dessus

### 🎉 Bonne découverte de Tantsaha Connect !

---

*Tantsaha Connect - Fitaovana ho an'ny tantsaha malagasy*