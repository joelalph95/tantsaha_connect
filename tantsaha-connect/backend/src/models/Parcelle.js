const db = require('../config/database');

class Parcelle {
  // Créer une parcelle
  static create(parcelle, callback) {
    const { nom_parcelle, superficie, localisation, id_paysan } = parcelle;
    const sql = `INSERT INTO PARCELLE (nom_parcelle, superficie, localisation, id_paysan) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [nom_parcelle, superficie, localisation, id_paysan], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id_parcelle: this.lastID, ...parcelle });
    });
  }

  // Récupérer toutes les parcelles
  static getAll(callback) {
    const sql = `
      SELECT p.*, pa.nom as paysan_nom, pa.prenom as paysan_prenom 
      FROM PARCELLE p
      LEFT JOIN PAYSAN pa ON p.id_paysan = pa.id_paysan
      ORDER BY p.nom_parcelle
    `;
    db.all(sql, [], callback);
  }

  // Récupérer les parcelles d'un paysan
  static getByPaysan(id_paysan, callback) {
    const sql = `
      SELECT p.*, 
        GROUP_CONCAT(pp.id_produit) as produits_ids,
        GROUP_CONCAT(pr.nom_produit) as produits_noms
      FROM PARCELLE p
      LEFT JOIN PARCELLE_PRODUIT pp ON p.id_parcelle = pp.id_parcelle
      LEFT JOIN PRODUIT_AGRICOLE pr ON pp.id_produit = pr.id_produit
      WHERE p.id_paysan = ?
      GROUP BY p.id_parcelle
      ORDER BY p.nom_parcelle
    `;
    db.all(sql, [id_paysan], callback);
  }

  // Récupérer une parcelle par ID
  static getById(id, callback) {
    const sql = `
      SELECT p.*, pa.nom as paysan_nom, pa.prenom as paysan_prenom 
      FROM PARCELLE p
      LEFT JOIN PAYSAN pa ON p.id_paysan = pa.id_paysan
      WHERE p.id_parcelle = ?
    `;
    db.get(sql, [id], callback);
  }

  // Mettre à jour une parcelle
  static update(id, parcelle, callback) {
    const { nom_parcelle, superficie, localisation, id_paysan } = parcelle;
    const sql = `UPDATE PARCELLE SET nom_parcelle = ?, superficie = ?, localisation = ?, id_paysan = ?, updated_at = CURRENT_TIMESTAMP WHERE id_parcelle = ?`;
    
    db.run(sql, [nom_parcelle, superficie, localisation, id_paysan, id], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id_parcelle: id, ...parcelle });
    });
  }

  // Supprimer une parcelle
  static delete(id, callback) {
    const sql = `DELETE FROM PARCELLE WHERE id_parcelle = ?`;
    db.run(sql, [id], function(err) {
      if (err) {
        callback(err, false);
        return;
      }
      callback(null, this.changes > 0);
    });
  }

  // Ajouter un produit à une parcelle
  static addProduit(id_parcelle, id_produit, data, callback) {
    const { saison, quantite_estimee, date_plantation, date_recolte_estimee } = data;
    const sql = `INSERT OR REPLACE INTO PARCELLE_PRODUIT (id_parcelle, id_produit, saison, quantite_estimee, date_plantation, date_recolte_estimee) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [id_parcelle, id_produit, saison, quantite_estimee, date_plantation, date_recolte_estimee], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { success: true });
    });
  }
}

module.exports = Parcelle;