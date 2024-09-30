const mongoose = require("mongoose");
const db = require("../model/index");
const Razorpay = require("razorpay");
const { json } = require("body-parser");
const path = require("path");
const fs = require("fs");

const razorpay = new Razorpay({
  key_id: "rzp_live_miuq50dflMActu",
  key_secret: "RoDC5o1uUqCUD3ziRCRuXrDi",
});

const createCategory = async (jsonBody) => {
  try {
    const category = new db.category({
      name: jsonBody.category,
    });
    try {
      const savedCategory = await category.save();
      return { name: savedCategory, message: "Category Created" };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return { error: "Validation Error", message: error.message };
      } else if (error.code === 11000) {
        return {
          error: "Duplicate Error",
          message: "Category name must be unique",
        };
      } else {
        return { error: "General Error", message: error.message };
      }
    }
  } catch (error) {
    return { error: "General Error", message: error.message };
  }
};

const categoryList = async () => {
  try {
    const categories = await db.category.find({});
    return categories;
  } catch (error) {
    return { error: "General Error", message: error.message };
  }
};

const createProduct = async (jsonBody) => {
  try {
    const newProduct = new db.product({
      name: jsonBody.name,
      price: Number(jsonBody.price) || 0, // Default to 0 if undefined
      descriptions: jsonBody.descriptions
        ? JSON.parse(jsonBody.descriptions)
        : {}, // Parse descriptions
      weight: Number(jsonBody.weight),
      packingcharges: Number(jsonBody.packingCharges),
      category: jsonBody.category,
      images: jsonBody.images || [],
      colors: jsonBody.colors ? JSON.parse(jsonBody.colors) : [], // Parse colors array
      isActive: true,
      isDeleted: false,
    });

    try {
      const savedProduct = await newProduct.save();
      return { status: true, message: savedProduct };
    } catch (error) {
      console.error("Error saving product:", error);
      return { status: false, message: error };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return { status: false, message: error };
  }
};

const productList = async () => {
  try {
    const products = await db.product.find().populate("category", "name");
    return products;
  } catch (error) {
    return { error: "General Error", message: error.message };
  }
};

const deleteProduct = async (jsonBody) => {
  try {
    // Find the product by ID
    const product = await db.product.findById(jsonBody.id);

    if (!product) {
      return { status: false, message: "Product not found" };
    }

    // Path to the uploads directory
    const uploadDir = path.join(__dirname, "uploads");

    // Delete each image file
    const deletePromises = product.images.map(async (imagePath) => {
      // Ensure imagePath is relative and does not include any extra directories
      const normalizedImagePath = imagePath.replace(/^uploads[\/\\]/, "");

      // Construct the full file path
      const fullPath = path.join(uploadDir, normalizedImagePath);
      console.log(`Attempting to delete file: ${fullPath}`);

      try {
        // Check if file exists before attempting to delete
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath); // Asynchronously delete the file
          console.log(`Deleted file: ${fullPath}`);
        } else {
          console.log(`File not found: ${fullPath}`);
        }
      } catch (err) {
        console.error(`Error deleting file ${fullPath}:`, err);
      }
    });

    // Wait for all file deletions to complete
    await Promise.all(deletePromises);

    // Delete the product document
    await db.product.findByIdAndDelete(jsonBody.id);

    return {
      status: true,
      message: "Product and associated images deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product and images:", error);
    return { status: false, message: "Error deleting product and images" };
  }
};

const bagBooking = async (jsonBody) => {
  const { total } = jsonBody;
  try {
    const payment_capture = 1;
    const currency = "INR";
    const options = {
      amount: total * 100,
      currency,
      receipt: "receipt1",
      payment_capture,
    };
    try {
      const response = await razorpay.orders.create(options);
      return { status: true, message: response };
    } catch (error) {
      return { status: false, message: error };
    }
  } catch (error) {
    return { status: false, message: error };
  }
};

const createOrder = async (jsonBody) => {
  console.log("jsonBody", jsonBody);
  try {
    const orderData = {
      customerData: {
        useremail: jsonBody.customerdata.useremail,
        name: jsonBody.customerdata.name,
        email: jsonBody.customerdata.email,
        phone: jsonBody.customerdata.phone,
        country: jsonBody.customerdata.country,
        city: jsonBody.customerdata.city,
        address: jsonBody.customerdata.address,
        postalCode: jsonBody.customerdata.postalCode,
      },
      cartItems: jsonBody.cartItem.map((item) => ({
        title: item.title,
        price: item.price,
        image: item.image01,
        description: item.desc,
        color: item.color,
        weight: item.weight,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      })),
      subtotal: jsonBody.subtotal,
      GST: jsonBody.GST,
      Shipping: jsonBody.shippingCost,
      totalAmount: jsonBody.totalAmount,
      cartQuantity: jsonBody.cartQuantity,
      payment: jsonBody.paymentJson,
    };

    const newOrder = new db.order(orderData);

    // Process each cart item and update stock
    for (const item of jsonBody.cartItem) {
      const product = await db.product.findById(item.id);

      // Find the specific color variant in the product's colors array
      const colorVariant = product.colors.find(
        (colorItem) => colorItem.color === item.color
      );

      if (!colorVariant) {
        return {
          status: false,
          message: `Color variant ${item.color} not available for ${item.title}`,
        };
      }

      // Check if the color variant has enough stock
      if (colorVariant.quantity < item.quantity) {
        return {
          status: false,
          message: `Not enough stock for ${item.title} in color ${item.color}`,
        };
      }

      // Reduce the stock for the specific color
      colorVariant.quantity -= item.quantity;

      // If the stock for this color variant is zero, deactivate the product
      if (colorVariant.quantity === 0) {
        product.isActive = false;
      }

      // Save the updated product with reduced stock
      await product.save();
    }
    // Save the order after all items are processed
    const savedOrder = await newOrder.save();
    console.log("order inserted into DB", savedOrder);
    return { status: true, message: savedOrder };
  } catch (error) {
    console.error(error);
    return { status: false, message: error.message };
  }
};

const orderList = async () => {
  try {
    const orders = await db.order.find({});
    return orders;
  } catch (error) {
    console.log(error);
    return { error: "General Error", message: error.message };
  }
};

const setDeliveryCharges = async (jsonBody) => {
  try {
    const charges = new db.deliveryCharges({
      deliveryCost: jsonBody.deliveryCharges,
    });
    const deliveryCharges = await charges.save();
    return { status: true, message: deliveryCharges };
  } catch (error) {
    return { status: false, message: error };
  }
};

const getDeliveryCharges = async (jsonBody) => {
  try {
    const charges = await db.deliveryCharges.find({});
    return charges;
  } catch (error) {
    console.log(error);
    return { status: false, message: error };
  }
};

const myOrderList = async (jsonBody) => {
  try {
    // Find orders by useremail
    const orders = await db.order.find({
      "customerData.useremail": jsonBody.useremail,
    });
    return { status: true, message: orders };
  } catch (error) {
    console.log(error);
    return { status: false, message: error };
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const updatedOrder = await db.order.findByIdAndUpdate(
      jsonBody.orderId,
      { status: jsonBody.newStatus, updatedAt: Date.now() },
      { new: true }
    );
    return { status: true, message: updatedOrder };
  } catch (error) {
    return { status: false, message: error };
  }
};

const getOrderStatus = async (orderId) => {
  try {
    const order = await db.order.findById(orderId).select("status");
    return { status: true, message: order };
  } catch (error) {
    return { status: false, message: error };
  }
};

const UpdateOrder = async (jsonBody) => {
  try {
    const order = await db.order.findById(jsonBody.orderId);
    if (!order) {
      return { status: false, message: "Order Nor Found" };
    }
    order.status = jsonBody.status;
    order.updatedAt = Date.now();
    try {
      const response = await order.save();
      return { status: true, message: response };
    } catch (error) {
      console.log(error);
      return { status: false, message: error };
    }
  } catch (error) {
    return { status: false, message: error };
  }
};

module.exports = {
  createCategory,
  categoryList,
  createProduct,
  productList,
  deleteProduct,
  createOrder,
  orderList,
  bagBooking,
  setDeliveryCharges,
  getDeliveryCharges,
  myOrderList,
  updateOrderStatus,
  getOrderStatus,
  UpdateOrder,
};
