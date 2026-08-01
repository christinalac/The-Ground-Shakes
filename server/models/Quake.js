const mongoose = require('mongoose');

const quakeSchema = new mongoose.Schema({
  usgsId: { type: String, required: true, unique: true },
  place: { type: String },
  magnitude: { type: Number },
  time: { type: Date },
  lon: { type: Number, required: true },
  lat: { type: Number, required: true },
  depth: { type: Number },
  url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Quake', quakeSchema);
