const express = require("express");
const xss = require("xss-clean");
const rateLimit = require('express-rate-limit')
const app = express();
const helmet = require('helmet');
// const router = express.Router();
var cors = require('cors')

app.use(cors())

app.use(helmet())
app.use('/', rateLimit())

// Data sanitization against XSS
app.use(xss());

app.get("/db/list", (req, res) => {
    res.status(200).send("<h1>Success...</h1>")
})

module.exports = app;