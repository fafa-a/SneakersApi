const express = require("express");
const app = express();
const sneaksCtl = require("./controlers/sneaksControler");

const router = express.Router();
const port = process.env.PORT || 8080;

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./routes/sneaksRoute");
routes(router);

router.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.use("/", router);

app.listen(port);

console.log("Sneakers API REST server started on: " + port);
