const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    email: String,
    region: String,
    district: String,
    commune: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', FarmerSchema);
