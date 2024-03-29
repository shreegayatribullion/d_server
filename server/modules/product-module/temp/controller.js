const pool = require("../../../../database");

const TABLE = "dog_temp_product";

exports.get = async (req, res, next) => {
  try {
    const { query, params } = req;
    const { id } = params;
    const { active } = query;
    let statement = "";
    if (active) {
      console.log("id", id);
      if (!id) {
        statement = `SELECT * FROM ${TABLE} WHERE archive = ${false} AND active =${true}`;
      } else {
        statement = `SELECT * FROM ${TABLE} WHERE archive = ${false} AND id = ${id} AND active =${true}`;
      }
    } else {
      if (req.user_detail.type === "user") {
        res.status(401).json({
          status: 401,
          message: "Not allowed!",
          success: false,
        });
        return;
      }
      statement = `SELECT * FROM ${TABLE} WHERE archive = ${false}`;
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
            message: "Data fetched successfuly",
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

exports.getProductsByBrands = async (req, res, next) => {
  const { params } = req;
  const { id: brand_id } = params;

  try {
    let statement = `SELECT DTP.*, dog_brands.image as brand_image, dog_brands.id as brand_id, dog_brands.name as brand_name
    FROM dog_temp_product AS DTP
    INNER JOIN dog_brands ON dog_brands.id = DTP.brand_id
    WHERE DTP.archive = false AND DTP.active = true AND DTP.brand_id = ${brand_id}`;

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
            message: "Data fetched successfuly",
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

exports.getProductsByCategory = async (req, res, next) => {
  const { params } = req;
  const { id: category_id } = params;

  try {
    let statement = `SELECT DTP.*, dog_category.image as category_image, dog_category.id as category_id, dog_category.name as category_name
    FROM dog_temp_product AS DTP
    INNER JOIN dog_category ON dog_category.id = DTP.category_id
    WHERE DTP.archive = false AND DTP.active = true AND DTP.category_id = ${category_id}`;

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
            message: "Data fetched successfuly",
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

exports.createProduct = async (req, res, next) => {
  const { body } = req;

  const {
    name,
    slug,
    title,
    description,
    unit,
    unit_value,
    mrp,
    sell_price,
    category_id,
    brand_id,
    file_name,
  } = body;

  const statement = `INSERT INTO ${TABLE} (
    name,	
    slug,
    title,	
    description,	
    unit,	
    unit_value,	
    mrp,	
    sell_price,	
    category_id,	
    brand_id,	
    image)  
    values(
      '${name}',	
      '${slug}',	
      '${title}',	
      '${description}',	
      '${unit}',	
      '${unit_value}',
      '${mrp}',
      '${sell_price}',
      ${category_id},
      ${brand_id},
      '${file_name}'
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
          message: "Record added successfuly",
          success: true,
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
  });
};

exports.update = async (req, res, next) => {
  const { body } = req;
  const {
    name,
    slug,
    title,
    description,
    unit,
    unit_value,
    mrp,
    sell_price,
    category_id,
    brand_id,
    file_name,
    id,
  } = body;

  let statement = "";

  let values;
  if (file_name) {
    statement = `
    UPDATE ${TABLE}
    SET name = ?,
        slug = ?,
        title = ?,
        description = ?,
        unit = ?,
        unit_value = ?,
        mrp = ?,
        sell_price = ?,
        category_id = ?,
        brand_id = ?,
        image = ?
    WHERE id = ?`;
    values = [
      name,
      slug,
      title,
      description,
      unit,
      unit_value,
      mrp,
      sell_price,
      category_id,
      brand_id,
      file_name,
      id,
    ];
  } else {
    statement = `
    UPDATE ${TABLE}
    SET name = ?,
        slug = ?,
        title = ?,
        description = ?,
        unit = ?,
        unit_value = ?,
        mrp = ?,
        sell_price = ?,
        category_id = ?,
        brand_id = ?
    WHERE id = ?`;
    values = [
      name,
      slug,
      title,
      description,
      unit,
      unit_value,
      mrp,
      sell_price,
      category_id,
      brand_id,
      id,
    ];
  }

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
          message: "not found",
          success: false,
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: "Record updated successfully",
        success: true,
        data: { id },
      });
    } catch (error) {
      console.log("error 2", error);
      res.status(500).json({
        message: "Ops something went wrong",
        status: 500,
        success: false,
      });
    }
  });
};

exports.updateActiveRecord = async (req, res, next) => {
  const { body } = req;
  const { id, active } = body;

  const updateStatement = `UPDATE ${TABLE} SET active = ${active} WHERE id = ${id};`;

  pool.query(updateStatement, (updateErr, updateResult, updateFields) => {
    if (updateErr) {
      console.log("updateErr", updateErr);
      // Handle the error
      return;
    }
    res.status(200).json({
      status: 200,
      message: "Record updated successfully",
      success: true,
      data: { id },
    });
  });
};

exports.delete = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;

    const statement = `UPDATE ${TABLE} set archive = ${true} where id = ${id}`;

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
            message: "Record deleted successfuly",
            success: true,
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
    });
  } catch (error) {
    console.log("error 2", error);
    res.status(500).json({
      message: "Ops something went wrong",
      status: 500,
      success: false,
    });
  }
};
