const { Router } = require("express");
const db = require("../db/queries");
const indexRouter = Router();

indexRouter.get("/", function(req, res) {
    const topProducts = db.getMostRecentProducts();
    topProducts.then(topProducts => {
        if(topProducts && topProducts.length > 0){
            res.render("index", {topProducts});
        } else {
            console.log("caz fara date, pagina ar trebui sa avem o pagina de fallback (eventual tot cea de eroare?");
        }
        
    }).catch((err) => {
        console.log("Caz eroare, ar trebui sa avem o pagina de eroare.")
    })
});

module.exports = indexRouter;