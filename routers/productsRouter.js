const { Router } = require("express");
const productsRouter = Router();
const productsController = require("../controller/productsController");

productsRouter.get("/", (req, res) => {
    const productsList = productsController.getProductsForPage(0, 40);
    productsList.then((result) => {
        if(result && result.length > 0){
            let products = result;
            res.render("products", {products});
        } else {
            res.render("/"); 
            // sau res.render("errorPage");
        }
    })
    productsList.catch((err) => {
        console.log(err);
        res.redirect("/");
        // res.render("errorPage");
    });
});

productsRouter.get("/create", (req, res) =>{
    const formObject = {
        product: {}, 
        isEdit: false
    }
    res.render("insertProduct", {formObject});
});

productsRouter.get("/edit/:id", (req, res) => {
    const productDetails = productsController.getProductDetails(req.params.id);
    productDetails.then(result => {
        const formObject = {
            product: result[0],
            isEdit: true
        };
        res.render("insertProduct", {formObject})
    })
})

productsRouter.post("/edit/:id", (req, res) => {
    const updateObj = {
        id: req.params.id,
        ...req.body
    }
    productsController.updateProduct(updateObj).then(() => {
        console.log("=== Product updated successfully! === ");
        res.redirect("/");
    })
})

productsRouter.get("/details/:id", (req, res) => {
    const productDetails = productsController.getProductDetails(req.params.id);
    productDetails.then((result) => {
        let products = result;
        if(products && products.length > 0){
            res.render('product', {products});
        } else {
            console.log("Caz fara date");
            res.end();
        }
    }).catch((err) => {
        console.log(err);
        res.redirect("/");
    })
});



productsRouter.get("/search", (req, res) => {
    const searchResult = productsController.getProductSearchPage(req.query.item);
    searchResult.then((result) => {
        if(result && result.length > 0){
            const products = result;
            res.render("products", {products});
        } else {
            console.log("Nu au fost gasite produse dupa termenul de cautare");
            // aici ar trebui redirect catre error page;
            res.redirect("/");
        }
    }).catch((err) => {
        console.log(err); 
        // aici din nou, error handling
    })
})

productsRouter.get("/create", (req, res) => {
    res.render("insertProduct");
});

productsRouter.post("/create", (req, res) => {
    const productDetails = req.body;
    productsController.createProduct(productDetails);
    res.redirect("/");
});

module.exports = productsRouter;