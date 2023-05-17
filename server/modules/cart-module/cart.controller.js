const pool = require("../../../database");
const logger = require("../../common/logger");

// if user's cart session found then find and return response of cart detail by session id
// exports.getCartBySessionId = async (req, res, next) => {
//   const { body } = req;
//   const { session_id } = body;

//   const statement = `SELECT * FROM dog_cart_item WHERE session_id = ${session_id}`;

//   pool.query(statement, (err, result, fileds) => {
//     try {
//       if (err) {
//         res.status(500).json({
//           status: 500,
//           message: err,
//           success: false,
//         });
//         return;
//       } else if (result) {
//         res.status(200).json({
//           message: "User's cart session & details found!",
//           status: 200,
//           success: true,
//           data: result[0],
//         });
//       }
//     } catch (error) {
//       logger.error(`error/AuthController/login${error}`);
//       res.status(500).json({
//         message: "Ops something went wrong",
//         status: 500,
//         success: false,
//       });
//     }
//   });
// };

exports.createCart = async (req, res, next) => {
  const { body } = req;
  const { product_id, user_id, quantity, total, session_id, price } = body;

  const validate_product_exist_statement = `SELECT * FROM dog_cart_item WHERE session_id = ${session_id} AND user_id = ${user_id} AND product_id = ${product_id}`;

  pool.query(validate_product_exist_statement, (err, result, fileds) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result?.length) {
        next();
      } else {
        const statement = `INSERT INTO dog_cart_item (
          product_id, 
          user_id, 
          quantity,
          price, 
          session_id,
          total
          ) 
          values(
          ${product_id},
          ${user_id},
          ${quantity},
          ${price},
          ${session_id},
          (price * quantity)
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
              res.status(200).json({
                status: 200,
                message: "cart created successfuly",
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

exports.updateCart = async (req, res, next) => {
  const { body } = req;
  const { product_id, user_id, session_id } = body;

  const statement = `UPDATE dog_cart_item SET quantity= quantity + 1, total = price * quantity
  WHERE session_id = ${session_id} AND product_id = ${product_id} AND user_id = ${user_id}`;

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
          status: 200,
          message: "cart updated successfuly",
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

exports.getCart = async (req, res, next) => {
  const { body } = req;
  const { session_id, user_id } = body;

  const statement = `SELECT * FROM dog_cart_item WHERE session_id = ${session_id} AND user_id = ${user_id}`;

  pool.query(statement, (err, result, fileds) => {
    console.log("result of get cart", result);
    console.log("result.length", result.length);
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      } else if (result) {
        console.log("result of cart detail", result);
        res.status(200).json({
          message: "User's cart session & details found!",
          status: 200,
          success: true,
          data: result,
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

exports.removeSingleItem = async (req, res, next) => {
  const { body } = req;
  const { session_id, user_id, product_id, current_qty } = body;

  console.log("currentQty", current_qty);
  try {
    if (current_qty === 1) {
      const statement = `DELETE FROM dog_cart_item WHERE 
    session_id = ${session_id} AND user_id = ${user_id} AND product_id = ${product_id}`;
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
          res.status(200).json({
            message: "User's cart Updated!",
            status: 200,
            success: true,
          });
        } catch (error) {
          logger.error(`error/AuthController/login${error}`);
          res.status(500).json({
            message: "Ops something went wrong",
            status: 500,
            success: false,
          });
        }
      });
    } else {
      const statement = `UPDATE dog_cart_item SET quantity = quantity - 1, total = price * quantity WHERE 
    session_id = ${session_id} AND user_id = ${user_id} AND product_id = ${product_id}`;
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

          res.status(200).json({
            message: "User's cart Updated!",
            status: 200,
            success: true,
            data: result,
          });
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
    console.log("error", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};
