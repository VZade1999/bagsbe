// models/DeliveryCharge.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for delivery charges
const deliveryChargeSchema = new Schema({
  deliveryCost: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update `updatedAt` field before saving
deliveryChargeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model using the schema
const DeliveryCharge = mongoose.model('DeliveryCharge', deliveryChargeSchema);

module.exports = DeliveryCharge;
