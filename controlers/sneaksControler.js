const klekt = require("../models/klekt-scraper");

exports.list_results = async function (req, res) {
  const response = await klekt("CW7603-400");
  res.status(200).json({ results: response });
};
