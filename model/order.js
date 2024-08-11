const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerData: {
      useremail: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    cartItems: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, require: true },
    GST: { type: Number, require: true },
    Shipping: { type: Number, require: true },
    totalAmount: { type: Number, required: true },
    cartQuantity: { type: Number, required: true },
    payment: { type: Object, required: true },
    status: {
      type: String,
      enum: [
        "Order Rejected",
        "Order Received",
        "Order Accepted",
        "Ready for ship",
        "On the way",
        "Order Delivered",
      ],
      default: "Order Received",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
