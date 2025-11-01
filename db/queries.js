const pool = require("./pool");

class CategoryOperations {
    async update(details){
        const SQL = `UPDATE category SET name = $2 
                    WHERE id = $1`
        if(details.id){
            await pool.query(SQL, [details.id, details.name]);
            return true;
        } 
        return false;
    }
}

async function getAllProducts() {
    const { rows } = await pool.query("SELECT * FROM product");
    return rows;
}

async function getMostRecentProducts(count){
    if(!count || count == null || count == 0) count = 10;
    const { rows } = await pool.query("SELECT * FROM product ORDER BY id DESC LIMIT $1;", [count]);
    return rows;
}

async function getProductById(id){
    if(id){
        const { rows } = await pool.query("SELECT * FROM product WHERE id = $1;", [id]);
        return rows;
    } else {
        return [];
    }
}

async function getNthPageOfProducts(pageNumber, pageLimit){
    if(pageLimit === null || pageLimit < 0) pageLimit = 10;
    const offset = pageNumber * pageLimit;
    if(pageNumber >= 0){
        const { rows } = await pool.query("SELECT * FROM product ORDER BY id DESC LIMIT $1 OFFSET $2;", [pageLimit, offset]);
        return rows;
    } else {
        const { rows } = await pool.query("SELECT * FROM product ORDER BY id DESC LIMIT $1;", [pageLimit]);
        return rows;
    }
}

async function getProductsBySearchTerm(searchTerm){
    if(searchTerm){
        const { rows } = await pool.query("SELECT * FROM product WHERE name ILIKE $1 ORDER BY id DESC;", [`%${searchTerm}%`]);
        return rows;
    } else{
        throw("No searchTerm");
    }    
};

async function getAllCategories() {
    const { rows } = await pool.query("SELECT * FROM category;");
    return rows;
}

async function getAllManufacturers(){
    const { rows } = await pool.query("SELECT * FROM manufacturer;");
    return rows;
}

async function getWarehousesList(){
    const { rows } = await pool.query("SELECT * FROM warehouse;");
    return rows;
}

async function getManufacturerById(manufacturerId){
    const { rows } = await pool.query("SELECT * FROM manufacturer WHERE manufacturer_id = $1;", [manufacturerId]);
    return rows;
}

async function insertProduct(productDetails){
    const SQL = `INSERT INTO product (name, description, price, category_id, product_code, manufacturer_id, creation_date, modified_on)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
    const insertedRow = await pool.query(SQL, [productDetails.name, productDetails.description, productDetails.price, productDetails.category_id, productDetails.productCode, productDetails.manufacturer_id, new Date(), new Date()])
    const productId = insertedRow.rows[0].id;
    const stockDetailsObj = {
        warehouseId: productDetails.warehouse_id,
        productId: productId,
        quantity: productDetails.quantity
    };
    await insertProductInStock(stockDetailsObj);
    return null;
}

async function insertProductInStock(stockDetails){
    console.log("stockDetails =  ", stockDetails)
    const stockSQL = `INSERT INTO stock (warehouse_id, product_id, quantity, creation_date, modified_on) VALUES($1, $2, $3, $4, $5)`;
    await pool.query(stockSQL, [stockDetails.warehouseId ? Number(stockDetails.warehouseId) : 1, stockDetails.productId, stockDetails.quantity, new Date(), new Date()]);
    return null;
}

async function updateProduct(productDetails){
    const SQL = `UPDATE product 
                SET name = $1, description = $2, price = $3, category_id = $4, manufacturer_id = $5, modified_on = $6, product_code = $7
                WHERE id = $8`;
    await pool.query(SQL, [productDetails.name, productDetails.description, productDetails.price, productDetails.category_id, productDetails.manufacturer_id, new Date(), productDetails.productCode, Number(productDetails.id)]);
    return null;
}

async function getAllCategories(){
    const SQL = `SELECT id, name from category;`;
    const { rows } = await pool.query(SQL);
    return rows;
}

async function insertCategory(categoryData){
    const SQL = `INSERT INTO category (name) VALUES($1) RETURNING id`;
    const insertedCategory = await pool.query(SQL, [categoryData.name]);
    return insertedCategory.rows[0];
}

async function associateCategoryToProduct(dataObj){
    const SQL = `UPDATE product SET category_id = $1 WHERE id = $2`
    if(dataObj.productId && dataObj.categoryId){
        await pool.query(SQL, [dataObj.productId, dataObj.categoryId]);
        return null;
    }
    return "Could not find productId or categoryId!";
}

async function getAllWarehouses(){
    const SQL = `SELECT * from warehouse`;
    const { rows } = await pool.query(SQL);
    return rows;
}

async function getProductsByCategory(categoryId){
    const SQL = `SELECT * from product INNER JOIN category ON product.category_id = category.id WHERE category.id = $1`;
    const { rows } = await pool.query(SQL, [categoryId]);
    return rows;
}

async function getAssociatedProductsToCategoryCount(categoryId){
    const SQL = `SELECT COUNT(*) FROM product WHERE category_id = $1`;
    const { rows } = await pool.query(SQL, [categoryId]);
    return rows;
}

async function getCategoryById(categoryId){
    const SQL = `SELECT * FROM category WHERE id = $1`;
    const { rows } = await pool.query(SQL, [categoryId]);
    return rows
}

async function deleteCategoryById(categoryId){
    const SQL = `DELETE FROM category WHERE id = $1`;
    await pool.query(SQL, [categoryId]);
    return true;
}

module.exports = {
    getAllProducts,
    getProductById,
    getNthPageOfProducts,
    getMostRecentProducts,
    getProductsBySearchTerm,
    getProductsByCategory,
    getAllCategories,
    getAllManufacturers,
    getManufacturerById,
    getWarehousesList,
    insertProduct,
    updateProduct,
    getAllCategories,
    insertCategory,
    getAllWarehouses,
    getCategoryById,
    deleteCategoryById,
    getAssociatedProductsToCategoryCount,
    CategoryOperations
}
