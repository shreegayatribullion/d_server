const insertProductList = async (connection, data) => {
  try {
    const { name, description, brief, category_id } = data;
    const productListStatement = `INSERT INTO dog_product_list (
    name,
    description,
    brief,
    category_id
  ) VALUES ('${name}', '${description}', '${brief}', ${category_id})`;

    return new Promise((resolve, reject) => {
      connection.query(productListStatement, (err, data) => {
        if (err) {
          console.log("rollback");
          reject(err);
        } else {
          console.log("data", data.insertId);
          resolve(data.insertId);
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

module.exports = { insertProductList };
