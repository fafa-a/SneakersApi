const getAllInfo = require("../models/sneakerSearch");

exports.list_results = async function (req, res) {
  const keyword = req.params.id;
  const response = await getAllInfo(keyword);
  // const response = data;
  // res.send(response);
  res.status(200).json(response);
};
