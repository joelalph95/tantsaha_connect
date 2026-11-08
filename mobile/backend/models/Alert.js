const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    parcelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parcel',
    },
    titre: {
      type: String,
      required: true,
    },
    description: String,
    severite: {
      type: String,
      enum: ['critical', 'danger', 'warning', 'success'],
      default: 'warning',
    },
    type: {
      type: String,
      enum: ['meteo', 'parasite', 'maladie', 'eau', 'sol'],
    },
    lu: {
      type: Boolean,
      default: false,
    },
    actions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', AlertSchema);
