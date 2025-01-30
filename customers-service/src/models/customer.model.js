// src/models/customer.model.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zip: String,
  country: String
}, { _id: false }); 
// _id: false => on n'a pas besoin d'un id distinct pour chaque élément

const customerSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  firstname: { type: String },
  lastname: { type: String },
  addresses: [addressSchema],  // tableau d'adresses
  avatarUrl: { type: String }, // ex: "uploads/avatar_<accountId>.png"
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', customerSchema);
