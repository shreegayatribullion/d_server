const express = require("express");
const controller = require("./controller");
const middleware = require("./middlewares/middleware");
const { postFile } = require("../utils/upload-service/mutler.service");

const router = express.Router();

router.get("/", controller.get);

router.post("/add", postFile, middleware.duplicate, controller.add);

router.post("/update", postFile, controller.update);

router.delete("/delete/:id", controller.delete);

module.exports = router;
