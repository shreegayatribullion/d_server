const pool = require("../../../database");
const logger = require("../../common/logger");

exports.Addaddress = async (req, res, next) => {
  try {
    let { body } = req;
    let { pincode, city, landmark, address, state, user_id } = body;

    const statement = `INSERT INTO dog_address (pincode, city, landmark, address, state, user_id) values(
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
