const db = require("../db/queries");

async function getProducts(req, res){
    const mostRecentProducts = await db.getMostRecentProducts();
    res.render("index", { mostRecentProducts });
};

async function getProductsForPage(pageNumber = 0, pageLimit = 10){
    const productsList = await db.getNthPageOfProducts(pageNumber, pageLimit);
    return productsList;
}

async function createProduct(productDetails){
    const processedProductDetails = preprocessProduct(productDetails);
    await db.insertProduct(processedProductDetails);
    return null;
}

async function getProductDetails(id){
    const productDetails = await db.getProductById(id);
    return productDetails;
}

async function getProductSearchPage(searchTerm){
    const searchResult = db.getProductsBySearchTerm(searchTerm);
    return searchResult;
}

function preprocessProduct(productObj){
    console.log(productObj);
    console.log("=== Processing productObj ===");
    const numericFields = ["price", "quantity"];
    const stringFields = ['name', 'description'];
    const lookupFields = ["warehouse_id", "manufacturer_id", "category_id"];
    const processed = {...productObj};

    for(const field of lookupFields){
        let value = processed[field];

        if(value == null || value == "" || (typeof value == "string" && value.trim() === "")){
            value = 1;
        }
        const lookupValue = Number(value);
        processed[field] = lookupValue;
    }
    
    for(const field of numericFields){
        let value = processed[field];

        if(value == null || value == "" || (typeof value == "string" && value.trim() === "")){
            value = 0;
        }

        const numericValue = Number(value);
        processed[field] = isNaN(numericValue) ? 0 : numericValue;
    }
    
    for(const field of stringFields){
        if(processed[field] !== null && typeof processed[field] === "string"){
            processed[field] = processed[field].trim();
        }
    }
    console.log("=== Finished processing ===");
    return processed;
}

async function updateProduct(productDetails){
    console.log("in controller, ", productDetails);
    const updateObj = preprocessProduct(productDetails);
    await db.updateProduct(updateObj);
    return null;
}

module.exports = {
    getProducts,
    getProductDetails,
    getProductsForPage,
    createProduct,
    getProductSearchPage,
    updateProduct
};