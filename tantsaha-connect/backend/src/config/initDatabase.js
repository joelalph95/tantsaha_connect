// backend/src/config/initDatabase.js

const db = require('./database');

// Petite fonction utilitaire pour utiliser db.run avec async/await
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this); // this contient lastID, changes, etc.
      }
    });
  });
};

// Création de toutes les tables selon votre MCD
const createTables = async () => {
  try {
    // Table PAYSAN
    await run(`
      CREATE TABLE IF NOT EXISTS PAYSAN (
        id_paysan INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        telephone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table PARCELLE
    await run(`
      CREATE TABLE IF NOT EXISTS PARCELLE (
        id_parcelle INTEGER PRIMARY KEY AUTOINCREMENT,
        nom_parcelle TEXT NOT NULL,
        superficie REAL,
        localisation TEXT,
        id_paysan INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE
      )
    `);

    // Table METEO
    await run(`
      CREATE TABLE IF NOT EXISTS METEO (
        id_meteo INTEGER PRIMARY KEY AUTOINCREMENT,
        date_meteo DATE NOT NULL,
        temperature REAL,
        humidite INTEGER,
        pluie TEXT,
        vent TEXT,
        id_paysan INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE
      )
    `);

    // Table ALERTE
    await run(`
      CREATE TABLE IF NOT EXISTS ALERTE (
        id_alerte INTEGER PRIMARY KEY AUTOINCREMENT,
        type_alerte TEXT NOT NULL,
        description TEXT,
        date_alerte DATE NOT NULL,
        niveau_urgence TEXT CHECK(niveau_urgence IN ('faible', 'moyen', 'élevé')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table ALERTE_PAYSAN
    await run(`
      CREATE TABLE IF NOT EXISTS ALERTE_PAYSAN (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paysan INTEGER,
        id_alerte INTEGER,
        statut TEXT DEFAULT 'non_vu' CHECK(statut IN ('vu', 'non_vu')),
        date_reception TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE,
        FOREIGN KEY (id_alerte) REFERENCES ALERTE(id_alerte) ON DELETE CASCADE,
        UNIQUE(id_paysan, id_alerte)
      )
    `);

    // Table OBSERVATION
    await run(`
      CREATE TABLE IF NOT EXISTS OBSERVATION (
        id_observation INTEGER PRIMARY KEY AUTOINCREMENT,
        date_observation DATE NOT NULL,
        description TEXT NOT NULL,
        photo TEXT,
        id_parcelle INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_parcelle) REFERENCES PARCELLE(id_parcelle) ON DELETE CASCADE
      )
    `);

    // Table CONSEIL
    await run(`
      CREATE TABLE IF NOT EXISTS CONSEIL (
        id_conseil INTEGER PRIMARY KEY AUTOINCREMENT,
        titre TEXT NOT NULL,
        description TEXT,
        audio TEXT,
        type_culture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table PRODUIT_AGRICOLE
    await run(`
      CREATE TABLE IF NOT EXISTS PRODUIT_AGRICOLE (
        id_produit INTEGER PRIMARY KEY AUTOINCREMENT,
        nom_produit TEXT NOT NULL,
        categorie TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Table PARCELLE_PRODUIT
    await run(`
      CREATE TABLE IF NOT EXISTS PARCELLE_PRODUIT (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_parcelle INTEGER,
        id_produit INTEGER,
        saison TEXT,
        quantite_estimee REAL,
        date_plantation DATE,
        date_recolte_estimee DATE,
        FOREIGN KEY (id_parcelle) REFERENCES PARCELLE(id_parcelle) ON DELETE CASCADE,
        FOREIGN KEY (id_produit) REFERENCES PRODUIT_AGRICOLE(id_produit) ON DELETE CASCADE,
        UNIQUE(id_parcelle, id_produit, saison)
      )
    `);

    // Table SYNC_LOG
    await run(`
      CREATE TABLE IF NOT EXISTS SYNC_LOG (
        id_sync INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paysan INTEGER,
        date_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        statut_sync TEXT CHECK(statut_sync IN ('succès', 'échec', 'en cours')),
        details TEXT,
        FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE
      )
    `);

    // Table PARAMETRE
    await run(`
      CREATE TABLE IF NOT EXISTS PARAMETRE (
        id_parametre INTEGER PRIMARY KEY AUTOINCREMENT,
        id_paysan INTEGER UNIQUE,
        langue TEXT DEFAULT 'mg',
        notifications BOOLEAN DEFAULT 1,
        mode_offline BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_paysan) REFERENCES PAYSAN(id_paysan) ON DELETE CASCADE
      )
    `);

    console.log('✅ Toutes les tables ont été créées avec succès!');

    // Insérer des données de démo
    await insertDemoData();
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  }
};

// Insérer des données de démo
const insertDemoData = async () => {
  try {
    // Insérer un paysan par défaut
    await run(
      `INSERT OR IGNORE INTO PAYSAN (nom, prenom, telephone) VALUES (?, ?, ?)`,
      ['Rakoto', 'Jean', '+261341234567']
    );

    // Insérer des produits agricoles malgaches
    const produits = [
      ['Riz', 'rizicole', 'Culture principale de Madagascar'],
      ['Manioc', 'tubercule', 'Culture vivrière importante'],
      ['Maïs', 'céréale', 'Pour consommation humaine et animale'],
      ['Haricot', 'légumineuse', 'Source de protéines'],
      ['Café', 'fruit', "Culture d'exportation"],
      ['Vanille', 'épice', 'Or noir de Madagascar'],
    ];

    for (const produit of produits) {
      await run(
        `INSERT OR IGNORE INTO PRODUIT_AGRICOLE (nom_produit, categorie, description) VALUES (?, ?, ?)`,
        produit
      );
    }

    // Insérer des conseils
    const conseils = [
      [
        'Semis du riz',
        'Semer le riz en début de saison des pluies pour une meilleure croissance',
        null,
        'riz',
      ],
      [
        'Irrigation du manioc',
        "Le manioc nécessite peu d'eau mais un bon drainage",
        null,
        'manioc',
      ],
      [
        'Rotation des cultures',
        'Alterner les cultures pour préserver la fertilité du sol',
        null,
        'général',
      ],
    ];

    for (const conseil of conseils) {
      await run(
        `INSERT OR IGNORE INTO CONSEIL (titre, description, audio, type_culture) VALUES (?, ?, ?, ?)`,
        conseil
      );
    }

    console.log('✅ Données de démo insérées avec succès!');
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion des données de démo:", error);
  }
};

// Exécuter l'initialisation
createTables().then(() => {
  console.log('🎉 Initialisation de la base de données terminée!');
  process.exit(0);
});
await db.run(`
  CREATE TABLE IF NOT EXISTS UTILISATEUR (
    id_utilisateur INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    telephone TEXT,
    role TEXT DEFAULT 'paysan' CHECK(role IN ('paysan', 'admin')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_derniere_connexion TIMESTAMP,
    est_actif BOOLEAN DEFAULT 1
  )
`);

// Insérer un utilisateur admin par défaut
await db.run(
  `INSERT OR IGNORE INTO UTILISATEUR (email, mot_de_passe, nom, prenom, role) VALUES (?, ?, ?, ?, ?)`,
  ['admin@tantsaha.mg', 'admin123', 'Admin', 'System', 'admin']
);