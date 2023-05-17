const pool = require("../../../database");
const logger = require("../../common/logger");

exports.getUsers = async = (req, res, next) => {
  try {
    const statement = `SELECT du.name, du.mobno, du.id as user_id, da.* FROM dog_user as du
    JOIN
    dog_address AS da WHERE da.user_id = du.id;`;

    pool.query(statement, async (err, result, fields) => {
      try {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
        } else if (result) {
          res.status(200).json({
            status: 200,
            message: "User list fetched!",
            data: result,
            success: true,
          });
        }
      } catch (error) {
        logger.error(`${error}`);
      }
    });
  } catch (error) {}
};

exports.getUserSession = async (req, res, next) => {
  try {
    let { params } = req;
    let { user_id } = params;

    const statement = `SELECT du.*, dss.*, dss.id as session_id, da.*, da.id as address_id from dog_user as du 
    INNER JOIN dog_shopping_session as dss ON dss.user_id = ${user_id}
    INNER JOIN dog_address as da ON da.user_id = ${user_id} where dss.active = 1`;

    pool.query(statement, async (err, result, fields) => {
      try {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
            success: false,
          });
        } else if (result) {
          let resultObj = result[0];
          res.status(200).json({
            status: 200,
            message: "User session found!",
            data: {
              user_data: {
                user_id: resultObj.user_id,
                name: resultObj.name,
                mobno: resultObj.mobno,
                state: resultObj.state,
                landmark: resultObj.landmark,
                pincode: resultObj.pincode,
                address: resultObj.address,
                address_id: resultObj.address_id,
                city: resultObj.city,
              },
              session_data: {
                total: resultObj.total,
                user_id: resultObj.user_id,
                session_id: resultObj.session_id,
              },
            },
            success: true,
          });
        }
      } catch (error) {
        logger.error(`${error}`);
      }
    });
    logger.info("addressController/Addaddress");
  } catch (error) {
    logger.error(`error occured ${error}`);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
    // next(error)
  }
};
