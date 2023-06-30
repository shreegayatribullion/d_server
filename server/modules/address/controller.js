const pool = require("../../../database");
const logger = require("../../common/logger");

const TABLE = "dog_address";

exports.add = async (req, res, next) => {
  try {
    let { body } = req;
    let { pincode, city, landmark, address, state, user_id } = body;

    const statement = `INSERT INTO ${TABLE} (pincode, city, landmark, address, state, user_id) values(
      ${pincode}, '${city}', 
      '${landmark}', '${address}',
      '${state}', ${user_id}
      )`;

    pool.query(statement, async (err, result, fields) => {
      try {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
        } else if (result) {
          res.status(200).json({
            status: 200,
            message: "Address added successfuly",
            data: { user_id: user_id },
            success: true,
          });
        }
      } catch (error) {
        logger.error(`${error}`);
        next();
      }
    });
    logger.info("addressController/Addaddress");
  } catch (error) {
    logger.error(`error occured ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    next();
    // next(error)
  }
};

exports.get = async (req, res, next) => {
  try {
    const { query } = req;
    const { user_id } = query;
    let statement = "";
    if (user_id) {
      statement = `SELECT * FROM ${TABLE} WHERE user_id = ${user_id}`;
    } else {
      console.log("req.user_detail", req.user_detail);
      if (req.user_detail.type === "user") {
        res.status(401).json({
          status: 401,
          message: "Not allowed!",
          success: false,
        });
        return;
      }
      statement = `SELECT * FROM ${TABLE}`;
    }

    pool.query(statement, async (err, result, fields) => {
      try {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
        } else if (result) {
          res.status(200).json({
            status: 200,
            message: "Address added successfuly",
            data: result,
            success: true,
          });
        }
      } catch (error) {
        logger.error(`${error}`);
        next();
      }
    });
    logger.info("addressController/Addaddress");
  } catch (error) {
    logger.error(`error occured ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    next();
    // next(error)
  }
};

exports.update = async (req, res, next) => {
  try {
    const { body } = req;
    const { pincode, city, landmark, address, state, user_id, address_id } =
      body;

    const statement = `UPDATE ${TABLE} SET pincode = ?, city = ?, landmark = ?, address = ?, state = ? WHERE user_id = ? AND id = ${address_id}`;
    const values = [pincode, city, landmark, address, state, user_id];

    pool.query(statement, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Error updating address",
          error: err,
          success: false,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 404,
          message: "Address not found",
          success: false,
        });
      }

      res.status(200).json({
        status: 200,
        message: "Address updated successfully",
        data: { user_id },
        success: true,
      });
    });

    logger.info("addressController/UpdateAddress");
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    next(error);
  }
};
