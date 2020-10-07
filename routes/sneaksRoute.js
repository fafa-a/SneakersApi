module.exports = function (router) {
  const sneaksCtl = require("../controlers/sneaksControler.js");

  router.route("/sneaks/:id").get(sneaksCtl.list_results);
};
