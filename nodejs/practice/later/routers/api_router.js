const express = require("express");


let api = express.Router();


api.get("/message", (req, res) => {
    res.end("message");
});


api.get("/users", (req, res) => {
    res.end("users");
});

module.exports = api;
