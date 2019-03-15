var express = require("express");
var path = require("path");
var app = express();

app.set("view engine", "ejs");
// 设置 ejs模板文件路径
app.set("views", path.resolve(__dirname, "views"));

app.get("/", function(req, res) {
    res.render("index");
});

app.listen(3000);
