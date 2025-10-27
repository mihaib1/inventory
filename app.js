require("dotenv").config();
const PORT = process.env.PORT ? process.env.PORT : 3000;

const indexRouter = require("./routers/indexRouter");
const productsRouter = require("./routers/productsRouter");
const path = require("node:path");
const express = require("express");
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", indexRouter);
app.use("/product", productsRouter);

app.listen(PORT, function(err){
    if(err){
        throw(err)
    } 
    console.log(`Server listening on port ${PORT}`);
});