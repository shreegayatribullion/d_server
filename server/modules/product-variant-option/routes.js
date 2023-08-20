const express = require("express");
const controller = require("./controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware.verifyToken, controller.get);

router.post("/add", authMiddleware.verifyToken, controller.add);

router.put("/update", authMiddleware.verifyToken, controller.update);

// safty check as middleware to be added that if product variant
// is mapped with any product item then delete is not allowed

router.delete("/delete/:id", authMiddleware.verifyToken, controller.delete);

module.exports = router;
