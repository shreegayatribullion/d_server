const pool = require("../../../database");
const { mapProductXVariant } = require("./helpers/map-product-x-variant");
const { insertProductList } = require("./helpers/product-list");

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

exports.createProductList = async (req, res, next) => {
  pool.getConnection(async function (err, connection) {
    if (err) throw err; // not connected!

    try {
      // start ->>>>>
      connection.beginTransaction();

      const { body } = req;

      const { name, description, brief, category_id } = body;

      // 1st create a product list and return the id of product
      const product_list_id = await insertProductList(connection, {
        name,
        description,
        brief,
        category_id,
      });

      // 2nd product_x_variant

      const product_x_variant = await mapProductXVariant(connection, {
        product_list_id,
      });

      // try {
      //   // main
      //   await insertAdmissionStatus(connection, {
      //     rescue_info_id: rescue_info_id,
      //     /////////////////////
      //     rescue_location_id: 1,
      //     rescue_animal_info_id: 2,
      //     rescue_animal_status_id: "3",
      //     created_by,
      //   });
      // } catch (error) {
      //   console.log("hereeee", "error");
      //   throw error;
      // }

      // AFTER ALL API CALL SUCCESS
      connection.commit();

      res.status(201).json({
        message: "Admission status created successfully",
        success: true,
      });
    } catch (error) {
      console.error(error);
      connection.rollback();
      res.status(500).json({
        message: "Oops! Something went wrong",
        success: false,
      });
    }
  });
};
