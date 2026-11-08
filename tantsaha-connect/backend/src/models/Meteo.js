const db = require('../config/database');

class Meteo {
  // Créer une entrée météo
  static create(meteo, callback) {
    const { date_meteo, temperature, humidite, pluie, vent, id_paysan } = meteo;
    const sql = `INSERT INTO METEO (date_meteo, temperature, humidite, pluie, vent, id_paysan) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [date_meteo, temperature, humidite, pluie, vent, id_paysan], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id_meteo: this.lastID, ...meteo });
    });
  }

  // Récupérer la météo du jour
  static getToday(id_paysan, callback) {
    const today = new Date().toISOString().split('T')[0];
    const sql = `SELECT * FROM METEO WHERE date_meteo = ? AND id_paysan = ? ORDER BY created_at DESC LIMIT 1`;
    
    db.get(sql, [today, id_paysan], callback);
  }

  // Récupérer les prévisions (7 derniers jours)
  static getForecast(id_paysan, callback) {
    const sql = `
      SELECT * FROM METEO 
      WHERE id_paysan = ? 
      AND date_meteo >= date('now', '-7 days')
      ORDER BY date_meteo DESC
    `;
    
    db.all(sql, [id_paysan], callback);
  }

  // Récupérer l'historique météo
  static getHistory(id_paysan, startDate, endDate, callback) {
    const sql = `SELECT * FROM METEO WHERE id_paysan = ? AND date_meteo BETWEEN ? AND ? ORDER BY date_meteo DESC`;
    
    db.all(sql, [id_paysan, startDate, endDate], callback);
  }

  // Mettre à jour les données météo
  static update(id, meteo, callback) {
    const { temperature, humidite, pluie, vent } = meteo;
    const sql = `UPDATE METEO SET temperature = ?, humidite = ?, pluie = ?, vent = ? WHERE id_meteo = ?`;
    
    db.run(sql, [temperature, humidite, pluie, vent, id], function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id_meteo: id, ...meteo });
    });
  }
}

module.exports = Meteo;