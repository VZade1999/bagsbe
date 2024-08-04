const db = {};

db.user = require("./user");
db.category = require("./category");
db.product = require("./product");
db.order = require("./order");
db.deliveryCharges = require("./deliveryCharges");



module.exports = db;
