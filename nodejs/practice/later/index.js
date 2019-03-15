const express = require("express");
const bodyParser = require('body-parser');
const morgan = require("morgan");
const path = require("path");

const apiRouter = require("./routers/api_router");

const app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();

const articles = [
    {
        title:'Example'
    }
];

app.use(morgan("short"));
app.use("/api", apiRouter);
app.use(express.static(path.resolve(__dirname, "imgs")));
app.use("/pictures", express.static(path.resolve(__dirname, "public")));
app.use("/public", express.static(path.resolve(__dirname, "public")));

//const port = process.env.PORT || 3000;
app.set("port", process.env.PORT || 3000);

app.get("/articles", (req, res, next) => {
    res.send(articles);
});

app.post("/articles", (req, res, next) => {
    res.send("OK");
});


app.get("/articles/:id", urlencodedParser, jsonParser, (req, res, next) => {
    const id = req.params.id;
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    console.log(`Fetching: ${id}`);
    res.send(articles[id]);
});

app.post("/articles/:id", jsonParser, (req, res, next) => {
    const id = req.params.id;
    console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    console.log(`Fetching: ${id}`);
    res.send(articles[id]);
});

app.delete("/articles/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(`Deleting: ${id}`);
    delete articles[id];
    res.send({message:'Deleted'});
});

/*
app.get("/my.jpg", (req, res) => {
    res.sendFile("my.jpg");
});
*/

app.get('/', (req, res) => {
    res.send("Hello Nodejs and Express");
});

app.listen(app.get('port'), () => {
console.log(process.env.NODE_ENV);

console.log(app.get('env'));
    console.log(`Express web app available at localhost: ${app.get('port')}`);
});

module.exports = app;
