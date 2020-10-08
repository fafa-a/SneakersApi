const got = require("got");

const { mkdir, writeFile } = require("../utils/FS");
const stockxApi = require("../data/dataStockX.json");
const dataStockx = require("../data/stockX.json");
const dir = "../data/";
const dataX = {};

async function getDataInfo() {
  const result = {};
  const stockx = {};
  const media = {};
  (media.img = stockxApi.Products[0].media.smallImageUrl),
    (media.thumbnail = stockxApi.Products[0].media.thumbUrl),
    (stockx.brand = stockxApi.Products[0].brand),
    (stockx.category = stockxApi.Products[0].category),
    (stockx.colorway = stockxApi.Products[0].colorway),
    (stockx.gender = stockxApi.Products[0].gender),
    (stockx.name = stockxApi.Products[0].name),
    (stockx.releaseDate = stockxApi.Products[0].releaseDate.slice(0, 10)),
    (stockx.retailPrice = stockxApi.Products[0].retailPrice),
    (stockx.shoe = stockxApi.Products[0].shoe),
    (stockx.shortDescription = stockxApi.Products[0].shortDescription),
    (stockx.styleId = stockxApi.Products[0].styleId),
    (stockx.urlKey = stockxApi.Products[0].urlKey),
    (stockx.url = `https://stockx.com/${stockx.urlKey}`),
    (stockx.media = media),
    (result.stockx = stockx);
  console.log("get info done");

  return result;
}

async function getVariants(href) {
  const response = await got(
    `https://stockx.com/api/products/${href}?includes=market`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
      },
      http2: true,
    }
  );
  const data = JSON.parse(response.body);
  const products = data.Product.children;
  const keys = Object.keys(products);

  const result = keys.map((key) => {
    const variants = {};
    variants.size = Number(products[key].shoeSize);
    variants.price = products[key].market.lowestAsk;
    return variants;
  });
  console.log("get variants done");
  return result;
}

async function getInfo(keyword) {
  try {
    await got(
      `https://stockx.com/api/browse?productCategory=sneakers&currency=EUR&_search="%22${keyword}%22"&dataType=product`
    )
      .then((response) => response.body)
      .then((data) => {
        mkdir(dir);

        writeFile(dir, "dataStockX.json", data);
      })
      .then(() => {
        const product = getDataInfo();
        return product;
      })
      .then((product) => {
        const resVariants = getVariants(product.stockx.urlKey);
        resVariants
          .then((variants) => {
            product.stockx.variants = variants;
            const jsonProduct = JSON.stringify(product);
            return jsonProduct;
          })
          .then((json) => {
            writeFile(dir, "stockX.json", json);
            console.log("Its written");
            // return data;
          });
        // .then((data) => {
        //   dataX.data = data;
        // });
        return dataStockx;
      });
  } catch (error) {
    console.log(error);
  }
}
getInfo("AJ4219-400");
module.exports = getInfo;
