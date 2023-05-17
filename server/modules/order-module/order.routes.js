const express = require("express");
const orderController = require("./order.controller");
const {
  updateCartSession,
  creatCartSession,
} = require("../cart-session-module/cart.session.controller");

const router = express.Router();

router.post(
  "/create",
  orderController.createOrderDetail,
  orderController.createOrderItems,
  updateCartSession,
  creatCartSession
);

module.exports = router;
