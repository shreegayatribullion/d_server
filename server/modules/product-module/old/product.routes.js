const express = require("express");
const productController = require("./product.controller");
const productMiddleware = require("../../../middlewares/product.middleware");
const { postFile } = require("../../utils/upload-service/mutler.service");

const router = express.Router();

router.get(
  "/get/bycategoryid/:category_id",
  productController.getProductsByCategoryId
);
router.get("/get", productController.getProducts);
router.delete("/delete/:id", productController.delete);
router.post(
  "/create",
  postFile,
  productMiddleware.duplicateProduct,
  productController.createProduct
);

module.exports = router;
