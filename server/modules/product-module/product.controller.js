const pool = require("../../../database");
const logger = require("../../common/logger");

exports.getProductsByCategoryId = async (req, res, next) => {
  try {
    const { params } = req;
    const { category_id } = params;

    const statement = `SELECT *, dp.id as product_id, dp.image as product_image,
    dp.slug as product_slug, 
    dc.image as category_image, 
    dc.slug as category_slug, dc.id as cateogry_id
    FROM dog_product as dp INNER JOIN dog_category as dc on dc.id = dp.category_id 
    where category_id = ${category_id}`;
    pool.query(statement, (err, result, fileds) => {
      console.log("result", result);
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
            message: "Product fetched successfuly",
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
  } catch (error) {
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { params } = req;
    const { category_id } = params;

    const statement = `SELECT *, dp.id as product_id, dp.image as product_image,
    dp.slug as product_slug, 
    dc.image as category_image, 
    dc.slug as category_slug, dc.id as cateogry_id
    FROM dog_product as dp INNER JOIN dog_category as dc on dc.id = dp.category_id`;
    pool.query(statement, (err, result, fileds) => {
      console.log("result", result);
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
            message: "Product fetched successfuly",
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
  } catch (error) {
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.createProduct = async (req, res, next) => {
  const { body } = req;
  const {
    name,
    slug,
    file_name,
    short_description,
    description,
    category_id,
    price,
    mrp,
  } = body;

  const getDiscount = () => {
    return (mrp * (100 - price)) / 100;
  };

  const statement = `INSERT INTO dog_product (name, slug, image, short_description, description, category_id, price, mrp, discount ) values(
    '${name}',
    '${slug}',
    '${file_name}',
    '${short_description}',
    '${description}',
    ${category_id},
    ${price},
    ${mrp},
    ${getDiscount()}
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
          message: "Product added successfuly",
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

exports.delete = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;

    const statement = `DELETE FROM dog_product WHERE id = ${id}`;

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
            message: "Product deleted successfuly",
            success: true,
          });
        }
      } catch (error) {
        logger.error(`error/product.controller/delete${error}`);
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
