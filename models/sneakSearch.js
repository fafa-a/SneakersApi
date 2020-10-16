const stockX = require("./stockx-scraper");
const flightClub = require("./flightClub-scraper");
const goat = require("./goat-scraper");
const klekt = require("./klekt-scraper");
// const sneakersHeat = require("./sneakersHeat-scraper");
// const weTheNew = require("./weTheNew-scraper");
console.time("x");
const research = async (keyword) => {
  const result = await Promise.all([
    await stockX(keyword),
    await flightClub(keyword),
    await goat(keyword),
    await klekt(keyword),
    // await sneakersHeat(keyword),
    // await weTheNew(keyword),
  ]);
  console.log(result);
  console.timeEnd("x");
  return result;
};

// module.exports = research;
research("cz5624 100");
