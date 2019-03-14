const express = require("express");
const bodyParser = require('body-parser');
const app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});
const jsonParser = bodyParser.json();

const articles = [
    {
        title:'Example'
    }
];

//const port = process.env.PORT || 3000;
app.set("port", process.env.PORT || 3000);

app.get("/articles", (req, res, next) => {
    res.send(articles);
});

app.post("/articles", (req, res, next) => {
    res.send("OK");
});


app.get("/articles/:id", urlencodedParser, (req, res, next) => {
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

app.get('/', (req, res) => {
    res.send("Hello Nodejs and Express");
});

app.listen(app.get('port'), () => {
    console.log(`Express web app available at localhost: ${app.get('port')}`);
});

module.exports = app;
