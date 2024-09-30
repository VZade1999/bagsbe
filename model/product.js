const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    descriptions: {
      shortDescription: {
        type: String,
        required: false,
      },
      longDescription: {
        type: String,
        required: false,
      },
      features: {
        type: String,
        required: false,
      },
    },
    weight: {
      type: Number,
      required: true,
    },
    packingcharges: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    colors: [
      {
        color: {
          type: String, // This will store color code (e.g., '#cc0000')
          required: true,
        },
        quantity: {
          type: Number, // Quantity available for the specific color
          required: true,
        },
        price: {
          type: Number, // Price for the specific color variation
          required: true,
        },
      },
    ],
    images: [
      {
        type: String, // Store image file paths
        required: false,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
