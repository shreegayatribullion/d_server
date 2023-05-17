const pool = require("../../../database");
const logger = require("../../common/logger");

// const createSession = (user_id) => {
//   const { params } = req;
//   const { user_id } = params;

//   const statement = `INSERT INTO dog_shopping_session (user_id, total)
//   value(${user_id}, ${0})`;

//   pool.query(statement, (err, result, fileds) => {
//     try {
//       if (err) {
//         return err;
//       } else if (result?.length) {
//         return result[0].id;
//       }
//     } catch (error) {
//       return error;
//     }
//   });
// };

exports.creatCartSession = async = (req, res, next) => {
  const { body } = req;
  const { user_id } = body;

  const statement = `INSERT INTO dog_shopping_session (user_id, total)
  value(${user_id}, ${0})`;

  console.log("statement", statement);

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
        res.status(200).json({
          message: "User's cart session created!",
          status: 200,
          success: true,
          data: result[0],
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

// get cart session if no session found then create one and then go next
exports.getCartSessionForUserSession = async = (req, res, next) => {
  const { params } = req;
  const { user_id } = params;

  const statement = `SELECT * FROM dog_shopping_session WHERE user_id = ${user_id} and active = 1`;

  pool.query(statement, (err, result, fileds) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (!result.length) {
        const statement = `INSERT INTO dog_shopping_session (user_id, total)
        value(${user_id}, ${0})`;

        pool.query(statement, (err, result, fileds) => {
          try {
            if (err) {
              res.status(500).json({
                status: 500,
                message: err,
                success: false,
              });
              return;
            }
            if (result) {
              req.body.session_id = result.insertId;
              next();
            }
          } catch (error) {
            console.log("error", error);
            logger.error(`error/AuthController/login${error}`);
            res.status(500).json({
              message: "Ops something went wrong",
              status: 500,
              success: false,
            });
          }
        });
      } else {
        req.body.session_id = result[0].id;
        next();
      }
    } catch (error) {
      console.log("error", error);
      logger.error(`error/AuthController/login${error}`);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.updateCartSession = async = (req, res, next) => {
  const { body } = req;
  const { user_id, session_id, total } = body;

  const statement = `UPDATE dog_shopping_session set active = 0, total = ${total} 
  where id = ${session_id} and user_id = ${user_id}`;

  pool.query(statement, (err, result, fileds) => {
    console.log("update result", result);
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        const statement = `INSERT INTO dog_shopping_session (user_id, total)
        value(${user_id}, ${0})`;

        console.log("statement", statement);

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
              res.status(200).json({
                message: "User's cart session created!",
                status: 200,
                success: true,
                // data: result[0],
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
