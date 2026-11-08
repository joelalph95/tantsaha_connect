const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Auth {
  // Créer un utilisateur
  static async createUser(userData) {
    const { email, mot_de_passe, nom, prenom, telephone, role } = userData;
    
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO UTILISATEUR (email, mot_de_passe, nom, prenom, telephone, role) VALUES (?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [email, hashedPassword, nom, prenom, telephone, role || 'paysan'], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id_utilisateur: this.lastID,
            email,
            nom,
            prenom,
            telephone,
            role: role || 'paysan'
          });
        }
      });
    });
  }

  // Trouver un utilisateur par email
  static findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM UTILISATEUR WHERE email = ?`;
      
      db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Mettre à jour la dernière connexion
  static updateLastLogin(id) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE UTILISATEUR SET date_derniere_connexion = CURRENT_TIMESTAMP WHERE id_utilisateur = ?`;
      
      db.run(sql, [id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  // Vérifier si l'email existe déjà
  static checkEmailExists(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as count FROM UTILISATEUR WHERE email = ?`;
      
      db.get(sql, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row.count > 0);
      });
    });
  }
}

module.exports = Auth;