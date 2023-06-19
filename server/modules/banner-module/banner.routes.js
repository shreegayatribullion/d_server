const express = require("express");
const catgoryController = require("./banner.controller");
const categoryMiddleware = require("../../middlewares/category.middleware");
const { postFile } = require("../utils/upload-service/mutler.service");

const router = express.Router();

router.get("/get", catgoryController.get);

router.post("/create", postFile, catgoryController.create);

router.delete("/delete/:id", catgoryController.delete);

module.exports = router;
