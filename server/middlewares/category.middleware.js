const pool = require("../../database");
const logger = require("../common/logger");

exports.duplicateCategory = async (req, res, next) => {
  try {
    let { body } = req;
    let { slug } = body;

    const statement = `SELECT * FROM dog_category WHERE slug = '${slug}'`;
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        console.log("results", results);
        logger.info(`results of middleware ${results}`);
        if (results?.length) {
          res.status(422).json({
            message: "Category already exist with the slug",
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
