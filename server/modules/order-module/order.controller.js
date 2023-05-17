const pool = require("../../../database");
const logger = require("../../common/logger");

// SELECT * FROM dog_category WHERE ID IN (8, 9,10,11)

exports.createOrderDetail = async (req, res, next) => {
  const { body } = req;
  const { user_id, total, payment_id, cart_detail } = body;

  const orderIdVsProductId = (order_id) => {
    console.log("cartDetail", cart_detail);
    console.log("orderId", order_id);
    let tempArr = [];
    for (let i = 0; i < cart_detail.length; i++) {
      tempArr.push([order_id, +cart_detail[i].product_id]);
    }
    return tempArr;
  };

  const statement = `INSERT INTO dog_order_details (
    user_id, 
    total, 
    payment_id) 
    values(
    ${user_id},
    ${total},
    '${payment_id}'
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
        req.order_id = result.insertId;
        req.orderItems = orderIdVsProductId(result.insertId);
        console.log(
          "orderIdVsProductId(result.insertId)",
          orderIdVsProductId(result.insertId)
        );
        next();
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

exports.createOrderItems = async (req, res, next) => {
  const { orderItems } = req;

  console.log("orderItems", orderItems);

  const statement = `INSERT INTO dog_order_items (
    order_id, 
    product_id
    ) 
    VALUES ?`;

  let values = orderItems;

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
        // req.order_id = result.insertId;
        next();
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
