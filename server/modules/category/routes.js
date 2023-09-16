const express = require("express");
const controller = require("./controller");
const middleware = require("./middlewares/middleware");
const { postFile } = require("../utils/upload-service/mutler.service");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware.addClientInfo, controller.get);

router.get("/highlight", authMiddleware.addClientInfo, controller.getHighlight);

router.get(
  "/petwise-category",
  authMiddleware.addClientInfo,
  controller.getPetwiseCategory
);

router.post("/add", authMiddleware.verifyToken, postFile, controller.add);

router.put("/update", authMiddleware.verifyToken, postFile, controller.update);

router.put(
  "/updateActiveRecord",
  authMiddleware.verifyToken,
  controller.updateActiveRecord
);

router.put(
  "/updateHighlightStatus",
  authMiddleware.verifyToken,
  controller.updateHighlightStatus
);

router.delete("/delete/:id", authMiddleware.verifyToken, controller.delete);

module.exports = router;
