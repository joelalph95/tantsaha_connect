const mongoose = require('mongoose');

const ObservationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    parcelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcel',
      required: true,
    },
    type: {
      type: String,
      enum: ['insecte', 'maladie', 'climat', 'sol', 'autre'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severite: {
      type: String,
      enum: ['faible', 'moyen', 'grave'],
      default: 'moyen',
    },
    images: [String],
    actionsPrises: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Observation', ObservationSchema);
