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
      price: jsonBody.price,
      stock: jsonBody.stock,
      description: jsonBody.description,
      weight: jsonBody.weight,
      packingcharges: jsonBody.packingCharges,
      category: jsonBody.category,
      images: jsonBody.images || [],
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
    console.log("Product details to be deleted:", product);

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
        description: item.desc,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      subtotal: jsonBody.subtotal,
      GST: jsonBody.GST,
      Shipping: jsonBody.shippingCost,
      totalAmount: jsonBody.totalAmount,
      cartQuantity: jsonBody.cartQuantity,
      payment: jsonBody.paymentJson,
    };

    const newOrder = new db.order(orderData);

    for (const item of jsonBody.cartItem) {
      const product = await db.product.findById(item.id);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;

        // Set product as out of stock if stock is zero
        if (product.stock === 0) {
          product.isActive = false;
        }

        await product.save();
        const savedOrder = await newOrder.save();
        return { status: true, message: savedOrder };
      } else {
        console.log(error);
        return { status: false, message: `Not enough stock for ${item.title}` };
      }
    }
    try {
      const savedOrder = await newOrder.save();
    } catch (error) {
      console.log(error);
    }

    return { status: true, message: savedOrder };
  } catch (error) {
    console.log(error);
    return { status: false, message: error };
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
    console.log(orders);
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
