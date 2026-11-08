const mongoose = require('mongoose');

const AdviceSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    titre: {
      type: String,
      required: true,
    },
    description: String,
    contenu: String,
    categorie: {
      type: String,
      enum: ['general', 'fertilisation', 'irrigation', 'parasites', 'maladie', 'sante_sol'],
      required: true,
    },
    source: String,
    lu: {
      type: Boolean,
      default: false,
    },
    datePublication: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advice', AdviceSchema);
