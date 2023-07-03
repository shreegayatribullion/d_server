const pool = require("../../../../database");
const logger = require("../../../common/logger");
const { secret } = require("../../../constant/secret.constant");

exports.AuthMiddleware = async (req, res, next) => {
  try {
    let { body } = req;
    let { name, mobno } = body;

    const statement = `SELECT * FROM dog_user WHERE mobno = ${mobno}`;

    const query = (statement) => {
      pool.query(statement, (err, result, fields) => {
        try {
          if (result[0].cnt > 0) {
            var token = jwt.sign({ mobno: mobno }, secret, {
              // expiresIn: 86400,
              expiresIn: 3600,
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
    query(statement);
  } catch (error) {
    logger.error(`error occured ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
