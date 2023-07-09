const pool = require("../../../database");
const logger = require("../../common/logger");

const TABLE = "dog_category";

exports.get = async (req, res, next) => {
  try {
    const { query } = req;
    const { active } = query;
    let statement = "";
    if (active) {
      statement = `SELECT * FROM ${TABLE} WHERE archive = ${false} AND active = ${true}`;
    } else {
      if (req.user_detail.type === "user") {
        res.status(401).json({
          status: 401,
          message: "Not allowed!",
          success: false,
        });
        return;
      }
      statement = `SELECT dc.*, GROUP_CONCAT(dptxc.pet_type_id) AS pet_type_ids
      FROM dog_category dc
      JOIN dog_pet_type_x_categories dptxc ON dc.id = dptxc.category_id
      WHERE dc.archive = 0
      GROUP BY dc.id;`;
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
          if (active) {
            res.status(200).json({
              status: 200,
              message: "Data fetched successfully",
              success: true,
              data: result,
            });
          } else {
            const formattedData = result.map((row) => {
              return {
                active: row.active,
                archive: row.archive,
                id: row.id,
                image: row.image,
                name: row.name,
                slug: row.slug,
                pet_type_ids: row.pet_type_ids.split(",").map(Number),
              };
            });
            res.status(200).json({
              status: 200,
              message: "Data fetched successfully",
              success: true,
              data: formattedData,
            });
          }
        }
      } catch (error) {
        res.status(500).json({
          message: "Oops, something went wrong",
          status: 500,
          success: false,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Oops, something went wrong",
      status: 500,
      success: false,
    });
  }
};

exports.add = async (req, res, next) => {
  const { body } = req;
  const { name, file_name, slug, pet_type_ids } = body;

  const petTypeIdVsCategoryId = (category_id) => {
    const petTypeIdsArray = pet_type_ids.split(",").map(Number);
    let tempArr = [];
    for (let i = 0; i < petTypeIdsArray.length; i++) {
      tempArr.push([category_id, +petTypeIdsArray[i]]);
    }
    return tempArr;
  };

  const statement = `INSERT INTO ${TABLE} (image, name, slug)  values(
    '${file_name}',
    '${name}',
    '${slug}'
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
        req.category_id = result.insertId;
        //HELPER FUNCTION MAPPING OF [1,1] ID OF PET_TYPE_ID AND CATEGORY_ID
        const petTypeIdxCategoryIdArray = petTypeIdVsCategoryId(
          result.insertId
        );

        const statement = `INSERT INTO dog_pet_type_x_categories (
          category_id,
          pet_type_id 
          ) 
          VALUES ?`;

        let values = petTypeIdxCategoryIdArray;

        pool.query(statement, [values], (err, result, fileds) => {
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
            console.log("error", error);
            res.status(500).json({
              message: "Ops something went wrong",
              status: 500,
              success: false,
            });
          }
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
  const { name, file_name, id, slug, pet_type_ids } = body;

  const petTypeIdsArray = pet_type_ids.split(",").map(Number);

  let statement = "";
  let values;
  if (file_name) {
    statement = `
      UPDATE ${TABLE}
      SET name = ?, image = ?, slug = ?
      WHERE id = ?`;
    values = [name, file_name, slug, id];
  } else {
    statement = `
      UPDATE ${TABLE}
      SET name = ?, slug = ?
      WHERE id = ?`;
    values = [name, slug, id];
  }

  pool.query(statement, values, (err, result) => {
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
          message: "Record not found",
          success: false,
        });
        return;
      }

      const deleteMappingStatement = `
        DELETE FROM dog_pet_type_x_categories
        WHERE category_id = ?`;
      pool.query(deleteMappingStatement, [id], (deleteErr, deleteResult) => {
        if (deleteErr) {
          res.status(500).json({
            status: 500,
            message: deleteErr,
            success: false,
          });
          return;
        }

        if (petTypeIdsArray && petTypeIdsArray.length > 0) {
          const insertMappingStatement = `
            INSERT INTO dog_pet_type_x_categories (category_id, pet_type_id)
            VALUES ?`;
          const values = petTypeIdsArray.map((petTypeId) => [id, petTypeId]);
          pool.query(
            insertMappingStatement,
            [values],
            (insertErr, insertResult) => {
              if (insertErr) {
                res.status(500).json({
                  status: 500,
                  message: insertErr,
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
            }
          );
        } else {
          res.status(200).json({
            status: 200,
            message: "Record updated successfully",
            success: true,
            data: { id },
          });
        }
      });
    } catch (error) {
      console.log("error 2", error);
      res.status(500).json({
        message: "Ops, something went wrong",
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

    const deleteStatement = `DELETE dc, dptxc
                             FROM ${TABLE} dc
                             LEFT JOIN dog_pet_type_x_categories dptxc ON dc.id = dptxc.category_id
                             WHERE dc.id = ${id}`;

    pool.query(deleteStatement, (err, result) => {
      try {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
          return;
        } else if (result.affectedRows > 0) {
          res.status(200).json({
            status: 200,
            message: "Record deleted successfully",
            success: true,
          });
        } else {
          res.status(404).json({
            status: 404,
            message: "Record not found",
            success: false,
          });
        }
      } catch (error) {
        console.log("error", error);
        res.status(500).json({
          message: "Oops, something went wrong",
          status: 500,
          success: false,
        });
      }
    });
  } catch (error) {
    console.log("error 2", error);
    res.status(500).json({
      message: "Oops, something went wrong",
      status: 500,
      success: false,
    });
  }
};
