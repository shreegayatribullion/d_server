const pool = require("../../../database");

const TABLE = "dog_product_variant";

exports.get = async (req, res, next) => {
  try {
    if (req.user_detail.type === "user") {
      res.status(401).json({
        status: 401,
        message: "Not allowed!",
        success: false,
      });
      return;
    }
    
    let statement = "";

    statement = `SELECT * FROM ${TABLE} WHERE archive = false`;



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

exports.add = async (req, res, next) => {
  const { body } = req;
  const { name } = body;

  const statement = `INSERT INTO ${TABLE} (name)  values(
    '${name}'
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
          data: result[0],
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

exports.update = async (req, res, next) => {
  const { body } = req;
  const { name, id } = body;

  let statement = "";
  let values;

  statement = `
    UPDATE ${TABLE}
    SET name = ? WHERE id = ?`;

  values = [name, id];

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
