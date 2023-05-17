const pool = require("../../../database");
const logger = require("../../common/logger");

//get user's cart session
exports.getUserCartSession = async = (req, res, next) => {
  const { params } = req;
  const { user_id } = params;

  const statement = `SELECT * FROM dog_shopping_session WHERE user_id = ${user_id}`;

  pool.query(statement, (err, result, fileds) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result?.length) {
        req.body.session_id = result[0].id;
        next();
        // res.status(200).json({
        //   message: "User's cart session found!",
        //   status: 200,
        //   success: true,
        //   data: result[0],
        // });
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

exports.createShoppingSession = async (req, res, next) => {
  const { body } = req;
  const { user_id, total } = body;

  const statement = `INSERT INTO dog_shopping_session (
    user_id, 
    total
    ) 
    values(
    ${user_id},
    ${total}
  )`;

  pool.query(statement, (err, result, fileds) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        console.log("result.insertId", result.insertId);
        req.body.session_id = result.insertId;
        next();
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
