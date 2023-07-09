const pool = require("../../../database");

const TABLE = "dog_pet_type";

exports.get = async (req, res, next) => {
  try {
    const { query } = req;
    const { active } = query;
    let statement = "";
    if (active) {
      statement = `SELECT * FROM ${TABLE} WHERE archive = ${false} AND active =${true}`;
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

exports.add = async (req, res, next) => {
  const { body } = req;
  const { name, file_name } = body;

  const statement = `INSERT INTO ${TABLE} (image, name)  values(
    '${file_name}',
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
  const { name, file_name, id } = body;

  let statement = "";
  let values;
  if (file_name) {
    statement = `
      UPDATE ${TABLE}
      SET name = ?, image = ? WHERE id = ?`;
    values = [name, file_name, id];
  } else {
    statement = `
    UPDATE ${TABLE}
    SET name = ? WHERE id = ?`;
    values = [name, id];
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
