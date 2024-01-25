const express = require("express");
const xss = require("xss-clean");
const rateLimit = require('express-rate-limit')
const app = express();
const helmet = require('helmet');
// const router = express.Router();
var cors = require('cors')

var AWS = require('aws-sdk');

app.use(cors())

app.use(helmet())

// UNCOMMENT THIS LINE AFTER DEBUGGING IS OVER
//app.use('/', rateLimit()) 

// Data sanitization against XSS
app.use(xss());

app.get("/db/list", (req, res) => {
    console.log("Listing db....")
    res.status(200).send("<h1>Success...</h1>")
})

module.exports = app;