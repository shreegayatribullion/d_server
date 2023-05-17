const express = require("express");
const {
  getCartSessionForUserSession,
} = require("../cart-session-module/cart.session.controller");
const { getUserSession, getUsers } = require("./user.session.controller");

const router = express.Router();

router.get("/get", getUsers);
router.get(
  "/usersession/getcompletesession/:user_id",
  getCartSessionForUserSession,
  getUserSession
);

module.exports = router;
