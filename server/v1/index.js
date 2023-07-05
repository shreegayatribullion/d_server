const express = require("express");
const auth = require("../modules/auth");
const address = require("../modules/address");
const category = require("../modules/category");
const staticBanner = require("../modules/static-banner");
const brands = require("../modules/brands");
////
const authMiddleware = require("../middlewares/auth.middleware");
///
const bannerRoutes = require("../modules/banner-module/banner.routes");
const productRoutes = require("../modules/product-module/product.routes");
const cartRoutes = require("../modules/cart-module/cart.routes");
const userRoutes = require("../modules/user-module/user.session.routes");
const cartSessionRoutes = require("../modules/cart-session-module/cart.session.routes");
const orderRoutes = require("../modules/order-module/order.routes");
const paymentRoutes = require("../modules/payment-module/payment.routes");

const router = express.Router();

router.use("/auth", auth);
router.use("/address", authMiddleware.verifyToken, address);
router.use("/category", authMiddleware.verifyToken, category);
router.use("/static-banner", staticBanner);
router.use("/brands", brands);
/////
router.use("/banner", bannerRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/user", userRoutes);
router.use("/cartsession", cartSessionRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
