const { json } = require("body-parser");
const productService = require("../service/productService");

async function createCategory(req, res) {
  try {
    const createCategoryResponse = await productService.createCategory(
      req.body
    );
    res.json(createCategoryResponse);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function categoryList(req, res) {
  try {
    const categoryList = await productService
      .categoryList()
      .then((data) => res.json(data))
      .catch((error) => res.json(error));
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, stock, description, category } = req.body;
    const images = req.files;
    const imagePaths = images ? images.map((file) => file.path) : [];
    const createProductResponse = await productService.createProduct({
      name,
      price,
      stock,
      description,
      category,
      images: imagePaths,
    });
    res.json(createProductResponse);
    res.status(200);
  } catch (error) {
    console.error("Error in createProduct controller:", error);
    res.json(error);
    res.status(404);
  }
}

async function productList(req, res) {
  try {
    const categoryList = await productService
      .productList()
      .then((data) => res.json(data))
      .catch((error) => res.json(error));
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function deleteProduct(req, res) {
  try {
    const categoryList = await productService.deleteProduct(req.body);
    res.json(categoryList);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function bagBooking(req, res) {
  try {
    const createOrderResponse = await productService.bagBooking(req.body);
    res.json(createOrderResponse);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function createOrder(req, res) {
  try {
    const createOrderResponse = await productService.createOrder(req.body);
    res.json(createOrderResponse);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function orderList(req, res) {
  try {
    const categoryList = await productService
      .orderList()
      .then((data) => res.json(data))
      .catch((error) => res.json(error));
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function setDeliveryCharges(req, res) {
  try {
    const deliveryChargesResponse = await productService.setDeliveryCharges(
      req.body
    );
    res.json(deliveryChargesResponse);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function getDeliveryCharges(req, res) {
  try {
    const getDeliveryCharges = await productService
      .getDeliveryCharges()
      .then((data) => res.json(data))
      .catch((error) => res.json(error));
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function myOrderList(req, res) {
  try {
    const myOrderListResponse = await productService.myOrderList(req.body);
    res.json(myOrderListResponse);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

async function UpdateOrder(req, res) {
  try {
    const UpdateOrderResponse = await productService.UpdateOrder(req.body);
    res.json(UpdateOrderResponse);
    res.status(200);
  } catch (error) {
    res.json(error);
    res.status(404);
  }
}

module.exports = {
  categoryList,
  createCategory,
  createProduct,
  productList,
  deleteProduct,
  createOrder,
  orderList,
  bagBooking,
  setDeliveryCharges,
  getDeliveryCharges,
  myOrderList,
  UpdateOrder,
};
