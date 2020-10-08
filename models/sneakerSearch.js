const flightClub = require("../models/flightClub-scraper");
const goat = require("../models/goat-scraper");
const klekt = require("../models/klekt-scraper");
const sneakersHeat = require("../models/sneakersHeat-scraper");
const stockx = require("../models/stockx-scraper");
const weTheNew = require("../models/weTheNew-scraper");

async function getAllInfo(keyword) {
  const response = [
    await stockx(keyword),
    await klekt(keyword),
    await goat(keyword),
    await flightClub(keyword),
    await sneakersHeat(keyword),
    await weTheNew(keyword),
  ];
  return response;
}
module.exports = getAllInfo;
