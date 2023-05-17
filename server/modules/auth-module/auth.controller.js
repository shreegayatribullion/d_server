const pool = require("../../../database");
const logger = require("../../common/logger");

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
        req.body.user_id = result.insertId;
        next();
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
    logger.info(`result of login ${result}`);
    try {
      if (result[0].cnt > 0) {
        res.status(200).json({
          message: "Logged in!",
          status: 200,
          success: true,
          data: result[0],
        });
      } else {
        res.status(422).json({
          message: "Invalid mobile number or password",
          status: 422,
          success: false,
        });
      }
    } catch (error) {
      logger.error(`error/AuthController/login${error}`);
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
