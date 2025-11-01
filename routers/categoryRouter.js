const { Router } = require("express");
const categoryRouter = Router();
const db = require("../db/queries");
const categoryController = require("../controller/categoryController");

categoryRouter.get("/", (req, res) => {
    const status = req.query.status || null;
    const getCategoriesList = categoryController.getAllCategories();
    getCategoriesList.then((result) => {
        let categories = result;
        res.render("categories", {categories, status});
    })
});

categoryRouter.get("/create", (req, res) => {
    res.render("categoryForm", {isEdit: false, category:{}});
});

categoryRouter.post("/create", (req, res) => {
    let formInput = {
        name: req.body.name
    };
    let insertResponse = categoryController.createCategory(formInput);
    insertResponse.then((result) => {
        if(result.isSuccess){
            res.redirect("/category");
        } else {
            console.log("Eroare la insert");
        }
    })
});

categoryRouter.get("/delete/:id", (req, res) =>{
    const id = req.params.id;
    const deleteResponse = categoryController.deleteCategory(id);
    deleteResponse.then((result) => {
        if(result.isSuccess){
            res.redirect('/category?status=removedSuccessfully');
        } else {
            res.redirect('/category?status=fail');
        }
    });
    deleteResponse.catch((err) => {
        console.log(err);
        res.redirect('/category'); // aici ar fi nevoie de error page;
    });
});

categoryRouter.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const currentCategoryDetails = categoryController.getCategoryDetails(id);
    currentCategoryDetails.then((result) => {
        res.render("categoryForm", {isEdit: true, category: result});
    });
});

categoryRouter.post("/edit/:id", (req, res) => {
    let formInput = {
        id: req.params.id,
        name: req.body.name
    }
    console.log("formInput = ", formInput);
    const updateOperation = categoryController.updateCategory(formInput);
    updateOperation.then((result) => {
        res.redirect('/category');
    })
    updateOperation.catch((err) => {
        console.log("A aparut o eroare la update");
    })
})


module.exports = categoryRouter;