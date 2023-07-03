const pool = require("../../../database");

const TABLE = "dog_static_banner";

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
  const { sub_title, title, file_name } = body;

  const statement = `INSERT INTO ${TABLE} (image, title, sub_title)  values(
    '${file_name}',
    '${title}',
    '${sub_title}'
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
  const { sub_title, title, file_name, id } = body;
  console.log("test data", sub_title, title, file_name, id);
  console.log("file_name there", file_name);
  let statement = "";
  let values;
  if (file_name) {
    statement = `
      UPDATE ${TABLE}
      SET title = ?, sub_title = ?, image = ? WHERE id = ?`;
    values = [title, sub_title, file_name, id];
  } else {
    statement = `
    UPDATE ${TABLE}
    SET title = ?, sub_title = ? WHERE id = ?`;
    values = [title, sub_title, id];
  }

  console.log("statement", statement);

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
        message: "Category updated successfully",
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

exports.updateActiveBanner = async (req, res, next) => {
  const { body } = req;
  const { id } = body;

  const updateStatement = `
  UPDATE ${TABLE}
  SET 
    active = CASE 
               WHEN id = ? THEN 1
               ELSE 0
             END
  WHERE id = ?;
`;

  const updateValues = [id, id];

  const deactivateStatement = `
  UPDATE ${TABLE}
  SET active = 0
  WHERE id != ?;
`;

  const deactivateValues = [id];

  pool.query(
    updateStatement,
    updateValues,
    (updateErr, updateResult, updateFields) => {
      if (updateErr) {
        console.log("updateErr", updateErr);
        // Handle the error
        return;
      }

      pool.query(
        deactivateStatement,
        deactivateValues,
        (deactivateErr, deactivateResult, deactivateFields) => {
          if (deactivateErr) {
            console.log("updateErr", deactivateErr);
            // Handle the error
            return;
          }

          // Both update and deactivate queries were successful
          res.status(200).json({
            status: 200,
            message: "Record updated successfully",
            success: true,
            data: { id },
          });
        }
      );
    }
  );
};

exports.delete = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;

    const statement = `UPDATE ${TABLE} set archive = ${true} where id = ${id} and active = ${false}`;

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
