const express = require("express");
const catgoryController = require("./category.controller");
const categoryMiddleware = require("../../middlewares/category.middleware");
const { postFile } = require("../utils/upload-service/mutler.service");

const router = express.Router();

router.get("/get", catgoryController.getCategories);

router.post(
  "/create",
  postFile,
  categoryMiddleware.duplicateCategory,
  catgoryController.createCategory
);

router.delete("/delete/:id", catgoryController.delete);

module.exports = router;
