const flightClub = require("../models/flightClub-scraper");
const goat = require("../models/goat-scraper");
const klekt = require("../models/klekt-scraper");
const sneakersHeat = require("../models/sneakersHeat-scraper");
const stockx = require("../models/stockx-scraper");
const weTheNew = require("../models/weTheNew-scraper");

async function getAllInfo(keyword) {
  const p1 = await stockx(keyword);
  const p2 = await klekt(keyword);
  const p3 = await goat(keyword);
  const p4 = await flightClub(keyword);
  const p5 = await sneakersHeat(keyword);
  const p6 = await weTheNew(keyword);
  const response = Promise.all(
    Promise.resolve(p1),
    Promise.resolve(p2),
    Promise.resolve(p3),
    Promise.resolve(p4),
    Promise.resolve(p5),
    Promise.resolve(p6)
  
    .then((value) => console.log(value))
    .catch((error) => {
      console.error(error.message);
    });
  return response;
}

module.exports = getAllInfo;
