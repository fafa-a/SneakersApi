const sneaksCtl = require("../controlers/sneaksControler.js");

module.exports = function (router) {
  router.route("/sneaks").get(sneaksCtl.list_results);
};
