const express = require("express");
const router = express.Router();
const userMngtController = require("../controller/userMngtController");
const productController = require("../controller/productsController");
const auth = require("../middleware/aut");

router.post("/register", userMngtController.registerUser);

router.post("/generateotp", userMngtController.generateOtp);

router.post("/validateotp", userMngtController.validateOtp);

router.post("/login", userMngtController.loginUser);

router.post("/createcategory", productController.createCategory);

router.get("/categorylist", productController.categoryList);

router.post("/createproduct", productController.createProduct);

router.get("/productlist", productController.productList);

router.post("/deleteproduct", productController.deleteProduct);

router.post("/bagbooking", auth.validateAuth, productController.bagBooking);

router.post("/createorder",auth.validateAuth, productController.createOrder);

router.get("/orderlist", productController.orderList);

router.post("/myorderlist", auth.validateAuth, productController.myOrderList);

router.post("/setdeliverycharges", productController.setDeliveryCharges);

router.get("/deliverycharges", productController.getDeliveryCharges);

module.exports = router;
