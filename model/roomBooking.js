const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: { type: String, required: true }, // Assuming user ID references a User collection
  roomType: { type: String, required: true },
  roomDescription: { type: String, required: true },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  numberOfDays: { type: Number, required: true },
  amount: { type: String, required: true },
  customer: {type: String, require: true},
  email: {type: String, required: true},
  phone: {type: String, required: true},
  address: {type:String, required: true}
}, {
  timestamps: true // This will automatically add `createdAt` and `updatedAt` fields
});

// Create the model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
