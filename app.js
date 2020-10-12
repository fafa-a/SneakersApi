const express = require("express");
const app = express();

const hostname = "http://localhost:";
const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.listen(port);
console.log(`Sneakers API server started on: ${hostname + port}`);
