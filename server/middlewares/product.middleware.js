const pool = require("../../database");
const logger = require("../common/logger");

exports.duplicateProduct = async (req, res, next) => {
  try {
    let { body } = req;
    let { slug, category_id } = body;

    const statement = `SELECT * FROM dog_product WHERE slug = '${slug}' AND category_id = ${category_id}`;
    const query = (statement) => {
      pool.query(statement, (error, results, fields) => {
        console.log("results", results);
        logger.info(`results of middleware ${results}`);
        if (results?.length) {
          res.status(422).json({
            message: "Product already exist with the slug and parent category",
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
