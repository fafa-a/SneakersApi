const stockX = require("./stockx-scraper");
const flightClub = require("./flightClub-scraper");
const goat = require("./goat-scraper");
const klekt = require("./klekt-scraper");
const sneakersHeat = require("./sneakersHeat-scraper");
const weTheNew = require("./weTheNew-scraper");

console.time("x");

const research = async (keyword) => {
  const result = await Promise.all([
    stockX(keyword),
    flightClub(keyword),
    goat(keyword),
    klekt(keyword),
    sneakersHeat(keyword),
    weTheNew(keyword),
  ]);

  console.timeEnd("x");

  return result;
};

research("cz5624 100");
module.exports = research;
