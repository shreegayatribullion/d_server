const express = require("express");
const controller = require("./controller");
const { postFile } = require("../../utils/upload-service/mutler.service");
const authMiddleware = require("../../../middlewares/auth.middleware");

const router = express.Router();

//
router.get("/", authMiddleware.addClientInfo, controller.get);

/**
 *
 */
router.get(
  "/byBrand/:id",
  authMiddleware.addClientInfo,
  controller.getProductsByBrands
);

/**
 *
 */
router.get(
  "/byCategory/:id",
  authMiddleware.addClientInfo,
  controller.getProductsByCategory
);

//
router.post(
  "/add",
  authMiddleware.verifyToken,
  postFile,
  controller.createProduct
);

//
router.put("/update", authMiddleware.verifyToken, postFile, controller.update);

//
router.put(
  "/updateActiveRecord",
  authMiddleware.verifyToken,
  controller.updateActiveRecord
);

//
router.delete("/delete/:id", authMiddleware.verifyToken, controller.delete);

module.exports = router;
