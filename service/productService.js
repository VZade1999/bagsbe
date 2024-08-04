const mongoose = require("mongoose");
const db = require("../model/index");
const Razorpay = require("razorpay");

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
      description: jsonBody.description,
      category: jsonBody.category,
      image: null,
      isActive: true,
      isDeleted: false,
    });
    try {
      const savedProduct = await newProduct.save();
      return { status: true, message: savedProduct };
    } catch (error) {
      return { status: false, message: error };
    }
  } catch (error) {
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
    const response = await db.product.findByIdAndDelete(jsonBody.id);
    return { status: true, message: response };
  } catch (error) {
    return { status: false, message: error };
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
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      totalAmount: jsonBody.totalAmount,
      cartQuantity: jsonBody.cartQuantity,
      payment: jsonBody.paymentJson,
    };
    const newOrder = new db.order(orderData);
    const savedOrder = await newOrder.save();
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
    return { status: true, message: orders[0].cartItems };
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
};
