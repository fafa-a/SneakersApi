const stockX = require("./stockx-scraper");
const flightClub = require("./flightClub-scraper");
const goat = require("./goat-scraper");
const klekt = require("./klekt-scraper");
const sneakersHeat = require("./sneakersHeat-scraper");
const weTheNew = require("./weTheNew-scraper");

const research = async (keyword) => {
  return (shop = await Promise.resolve([
    await stockX(keyword),
    await klekt(keyword),
    await flightClub(keyword),
    await goat(keyword),
    await sneakersHeat(keyword),
    await weTheNew(keyword),
  ]));
};
module.exports = research;
