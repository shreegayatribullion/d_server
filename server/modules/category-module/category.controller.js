const pool = require("../../../database");
const logger = require("../../common/logger");

exports.getCategories = async (req, res, next) => {
  try {
    const statement = `SELECT * from dog_category`;

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
            message: "Category fetched successfuly",
            success: true,
            data: result,
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
  } catch (error) {
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.createCategory = async (req, res, next) => {
  const { body } = req;
  const { name, slug, file_name, short_description } = body;

  const statement = `INSERT INTO dog_category (name, slug, image, short_description)  values(
    '${name}',
    '${slug}',
    '${file_name}',
    '${short_description}'
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
          message: "Category added successfuly",
          success: true,
          data: result[0],
        });
      }
    } catch (error) {
      logger.error(`error/category.controller/create${error}`);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.delete = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;

    const statement = `DELETE FROM dog_category WHERE id = ${id}`;

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
            message: "Category deleted successfuly",
            success: true,
          });
        }
      } catch (error) {
        logger.error(`error/category.controller/create${error}`);
        res.status(500).json({
          message: "Ops something went wrong",
          status: 500,
          success: false,
        });
      }
    });
  } catch (error) {
    logger.error(`error/category.controller/delete${error}`);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const { body } = req;
    const { name, slug, file_name, short_description } = body;

    // const statement = `INSERT INTO dog_category (name, slug, image, short_description)  values(
    //   '${name}',
    //   '${slug}',
    //   '${file_name}',
    //   '${short_description}'
    // )`;

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
            message: "Category added successfuly",
            success: true,
            data: result[0],
          });
        }
      } catch (error) {
        logger.error(`error/category.controller/create${error}`);
        res.status(500).json({
          message: "Ops something went wrong",
          status: 500,
          success: false,
        });
      }
    });
  } catch (error) {
    logger.error(`error/category.controller/delete${error}`);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};
