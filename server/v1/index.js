const express = require("express");
const authRoutes = require("../modules/auth-module/auth.routes");
const cateogryRoutes = require("../modules/category-module/category.routes");
const bannerRoutes = require("../modules/banner-module/banner.routes");
const productRoutes = require("../modules/product-module/product.routes");
const cartRoutes = require("../modules/cart-module/cart.routes");
const userRoutes = require("../modules/user-module/user.session.routes");
const cartSessionRoutes = require("../modules/cart-session-module/cart.session.routes");
const orderRoutes = require("../modules/order-module/order.routes");
const paymentRoutes = require("../modules/payment-module/payment.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/category", cateogryRoutes);
router.use("/banner", bannerRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/user", userRoutes);
router.use("/cartsession", cartSessionRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
