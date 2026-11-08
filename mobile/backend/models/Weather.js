const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    localisation: {
      ville: String,
      latitude: Number,
      longitude: Number,
    },
    condition: {
      type: String,
      enum: ['ensoleille', 'nuageux', 'pluvieux', 'orageux'],
    },
    temperature: Number,
    humidite: Number,
    vitesseVent: Number,
    precipitations: Number,
    indiceUV: Number,
    previsions: [
      {
        jour: Date,
        condition: String,
        tempMin: Number,
        tempMax: Number,
        probabilitePluie: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Weather', WeatherSchema);
