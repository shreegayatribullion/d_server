const pool = require("../../../database");
const logger = require("../../common/logger");

const TABLE = "dog_category";

exports.get = async (req, res, next) => {
  try {
    const { query } = req;
    const { category_id } = query;

    let statement = "";
    if (category_id) {
      statement = `SELECT * FROM ${TABLE} WHERE id = ${category_id}`;
    } else {
      statement = `SELECT * FROM ${TABLE}`;
    }

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

exports.add = async (req, res, next) => {
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
  const { body } = req;
  const { category_id, name, slug, file_name, short_description } = body;

  const statement = `
    UPDATE dog_category
    SET name = ?, slug = ?, image = ?, short_description = ?
    WHERE category_id = ?`;

  const values = [name, slug, file_name, short_description, category_id];

  pool.query(statement, values, (err, result, fields) => {
    try {
      if (err) {
        res.status(500).json({
          status: 500,
          message: err,
          success: false,
        });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({
          status: 404,
          message: "Category not found",
          success: false,
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "Category updated successfully",
        success: true,
        data: { category_id },
      });
    } catch (error) {
      logger.error(`error/category.controller/update ${error}`);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};
