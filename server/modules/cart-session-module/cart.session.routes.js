const express = require("express");
const {
  creatCartSession,
  updateCartSession,
} = require("./cart.session.controller");

const router = express.Router();

router.post("/create", creatCartSession);
router.post("/updateSession", updateCartSession, creatCartSession);

module.exports = router;
