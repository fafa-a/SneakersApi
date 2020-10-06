const data = require("./test.json");
const product = {};

(product.brand = data.Products[0].brand),
  (product.gender = data.Products[0].gender),
  (product.category = data.Products[0].category),
  (product.colorway = data.Products[0].colorway),
  (product.thumbnail = data.Products[0].media.thumbUrl),
  (product.img = data.Products[0].media.smallImageUrl),
  (product.name = data.Products[0].name),
  (product.releaseDate = data.Products[0].releaseDate.slice(0, 10));
product.retailPrice = data.Products[0].retailPrice;
product.shoe = data.Products[0].shoe;
product.shortDescription = data.Products[0].shortDescription;
product.styleId = data.Products[0].styleId;
product.urlKey = data.Products[0].urlKey;
product.url = `https://stockx.com/${product.urlKey}`;

module.exports = product;
