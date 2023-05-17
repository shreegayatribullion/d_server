const express = require("express");
const authController = require("./auth.controller");
const addressController = require("../address-module/address.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/signup",
  authMiddleware.AuthMiddleware,
  authController.singup,
  addressController.Addaddress,
  authController.deleteUser
);

router.post("/login", authController.login);

module.exports = router;
