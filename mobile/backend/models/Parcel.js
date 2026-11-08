const mongoose = require('mongoose');

const ParcelSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    nom: {
      type: String,
      required: true,
    },
    surface: {
      type: Number,
      required: true,
    },
    localisation: {
      type: String,
      required: true,
    },
    cultures: [String],
    dateDebut: Date,
    etat: {
      type: String,
      enum: ['preparation', 'semis', 'croissance', 'floraison', 'recolte'],
      default: 'preparation',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Parcel', ParcelSchema);
