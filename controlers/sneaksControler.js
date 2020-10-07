const flightClub = require("../models/flightClub-scraper");
const goat = require("../models/goat-scraper");
const klekt = require("../models/klekt-scraper");
const sneakersHeat = require("../models/sneakersHeat-scraper");
const stockx = require("../models/stockx-scraper");
const weTheNew = require("../models/weTheNew-scraper");

exports.list_results = async function (req, res) {
  const keyword = req.params.id;
  const response = [
    await stockx(keyword),
    await klekt(keyword),
    await goat(keyword),
    await flightClub(keyword),
    await sneakersHeat(keyword),
    await weTheNew(keyword),
  ];
  // const response = data;
  // res.send(response);
  res.status(200).json({ results: response });
};
