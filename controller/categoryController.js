const db = require("../db/queries");

async function getAllCategories(){
    const categoriesList = await db.getAllCategories();
    return categoriesList;
}

async function getCategoryDetails(id){
    const details = await db.getCategoryById(id);
    return details[0];
}

async function deleteCategory(id){
    let response = {
        isSuccess: false,
        message: null
    };
    const associatedProductsToCategory = await db.getAssociatedProductsToCategoryCount(id);
    const productsCount = Number(associatedProductsToCategory[0].count);
    if(Number(productsCount) == 0){
        const categoryDetails = await db.getCategoryById(id);
        if(categoryDetails.length > 0){
            db.deleteCategoryById(id);
            response.isSuccess = true;
            response.message = `Deleted the category successfully!`;
        } else {
            response.message = `Could not find the category!`;
        }
    } else {
        response.message = `There are products associated to this category!`;
    }
    return response;
}

async function createCategory(details){
    let response = {
        isSuccess: false
    }
    const newCategoryEntry = await db.insertCategory(details);
    const newId = newCategoryEntry.id;
    if(newId){
        response.id = newId;
        response.isSuccess = true;
    }
    return response;
}

async function updateCategory(details){
    let response = {
        isSuccess: false
    };
    const operations = new db.CategoryOperations();
    let updateResult = operations.update(details);
    if(updateResult){
        response.isSuccess = true;
    }
    return response;
}

module.exports = {
    getAllCategories,
    deleteCategory,
    createCategory,
    getCategoryDetails,
    updateCategory
}