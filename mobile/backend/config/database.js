const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    // Use local MongoDB for development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobile-app';

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    console.log('Assurez-vous que MongoDB est en cours d\'exécution ou que MONGODB_URI est correctement configuré pour MongoDB Atlas.');
    // Removed process.exit(1) to allow server to start even if DB connection fails
  }
};

module.exports = connectDB;
