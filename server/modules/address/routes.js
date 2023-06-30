const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.get);
router.post("/add", controller.add);
router.put("/update", controller.update);

module.exports = router;
