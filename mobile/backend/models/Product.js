const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
    },
    nom: {
      type: String,
      required: true,
    },
    type: String,
    quantite: Number,
    unite: String,
    prixUnitaire: Number,
    dateAchat: Date,
    dateExpiration: Date,
    fournisseur: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
