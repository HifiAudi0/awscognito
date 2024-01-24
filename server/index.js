const https = require('https');
const fs = require('fs');
const app = require("./app")



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log("App is running on port", port)
});

