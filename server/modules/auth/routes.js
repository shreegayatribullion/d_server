const express = require("express");
const authController = require("./controller");
const authMiddleware = require("./middleware/auth.middleware");

const router = express.Router();

router.post("/signup", authMiddleware.AuthMiddleware, authController.singup);

router.post("/login", authController.login);

router.post("/admin/login", authController.adminLogin);

module.exports = router;
