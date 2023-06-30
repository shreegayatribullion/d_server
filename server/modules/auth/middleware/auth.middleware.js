const pool = require("../../../../database");
const logger = require("../../../common/logger");

exports.AuthMiddleware = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, mobno } = body;

    const statement = `SELECT * FROM dog_user WHERE mobno = ${mobno}`;

    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        logger.info(`results of middleware ${results}`);
        if (results?.length) {
          res.status(422).json({
            message: "User already exist with the name and mobile number",
          });
        } else {
          next();
        }
      });
    };
    query(statement);
  } catch (error) {
    logger.error(`error occured ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
