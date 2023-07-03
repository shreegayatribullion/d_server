const pool = require("../../../database");
const logger = require("../../common/logger");
const jwt = require("jsonwebtoken");
const { secret } = require("../../constant/secret.constant");

exports.singup = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, password, mobno, pincode, city, landmark, address, state } =
      body;
    logger.info("In authController/signup");

    const statement = `INSERT INTO dog_user (name, password, mobno) values('${name}', '${password}', ${mobno})`;

    pool.query(statement, async (err, result, fields) => {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      }
      if (result) {
        res.status(200).json({
          status: 200,
          message: "User created successfuly",
          data: { user_id: result.insertId },
          success: true,
        });
        // req.body.user_id = result.insertId;
        // next();
      }
    });
  } catch (error) {
    logger.error(`error occured ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    // next(error)
  }
};

exports.login = async (req, res, next) => {
  const { body } = req;
  const { mobno, password } = body;

  let statement = `SELECT *, COUNT(*) AS cnt FROM dog_user WHERE mobno = ${mobno} AND password = '${password}'`;

  pool.query(statement, (err, result, fields) => {
    try {
      if (result[0].cnt > 0) {
        var token = jwt.sign({ mobno: mobno, type: "user" }, secret, {
          // expiresIn: 86400,
          expiresIn: 10600,
        });
        res.status(200).json({
          message: "Logged in!",
          status: 200,
          success: true,
          data: { ...result[0], token },
        });
      } else {
        res.status(422).json({
          message: "Invalid mobile number or password",
          status: 422,
          success: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.adminLogin = async (req, res, next) => {
  const { body } = req;
  const { user_name, password } = body;

  let statement = `SELECT *, COUNT(*) AS cnt FROM dog_admin WHERE user_name = '${user_name}' AND password = '${password}'`;

  pool.query(statement, (err, result, fields) => {
    try {
      if (result[0].cnt > 0) {
        var token = jwt.sign({ user_name: user_name, type: "admin" }, secret, {
          // expiresIn: 86400,
          expiresIn: 10600,
        });
        res.status(200).json({
          message: "Logged in!",
          status: 200,
          success: true,
          data: { ...result[0], token },
        });
      } else {
        res.status(422).json({
          message: "Invalid password",
          status: 422,
          success: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};
/* Forgot password / change password */

exports.deleteUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { user_id } = body;
    console.log("user_id", user_id);
    const statement = `DELETE FROM dog_user WHERE ID = ${user_id}`;
    pool.query(statement, (error, result, fields) => {
      if (error) {
        res.status(500).json({
          message: error,
          success: false,
          code: 500,
        });
        return;
      }
      console.log("result", result);
      if (result) {
        res.status(422).json({
          message: "User deleted",
          success: true,
          code: 200,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      success: false,
      code: 500,
    });
  }
};
