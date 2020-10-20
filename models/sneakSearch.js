const stockX = require("./stockx-scraper");
const flightClub = require("./flightClub-scraper");
const goat = require("./goat-scraper");
const klekt = require("./klekt-scraper");
const sneakersHeat = require("./sneakersHeat-scraper");
const weTheNew = require("./weTheNew-scraper");

const research = async (keyword) => {
  try {
    const result = await Promise.all([
      stockX(keyword),
      flightClub(keyword),
      goat(keyword),
      klekt(keyword),
      sneakersHeat(keyword),
      weTheNew(keyword),
    ]);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = research;
