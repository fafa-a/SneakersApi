const axios = require("axios");
// const { mkdir, writeFile } = require("../utils/FS");
// const dir = "../data/";

const getInfo = async function (keyword) {
  try {
    const response = await axios.get(
      `https://stockx.com/api/browse?productCategory=sneakers&currency=EUR&_search=${keyword}&dataType=product`,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "User-Agent":
            "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
        },
      }
    );

    const { data } = response;
    const product = await getDataInfo(data);
    const variants = await getVariants(product.stockx.urlKey);
    product.stockx.variants = variants;
    const dataStockx = JSON.stringify(product);
    // mkdir(dir);
    // writeFile(dir, "stockX.json", dataStockx);

    return product;
  } catch (error) {
    console.error(error);
  }
};
async function getDataInfo(data) {
  const result = {};
  const stockx = {};
  const media = {};

  (media.img = data.Products[0].media.smallImageUrl),
    (media.thumbnail = data.Products[0].media.thumbUrl),
    (stockx.brandName = data.Products[0].brand),
    (stockx.category = data.Products[0].category),
    (stockx.colorway = data.Products[0].colorway),
    (stockx.gender = data.Products[0].gender),
    (stockx.name = data.Products[0].name),
    (stockx.releaseDate = data.Products[0].releaseDate.slice(0, 10)),
    (stockx.retailPrice = data.Products[0].retailPrice),
    (stockx.shoe = data.Products[0].shoe),
    (stockx.shortDescription = data.Products[0].shortDescription),
    (stockx.sku = data.Products[0].styleId),
    (stockx.urlKey = data.Products[0].urlKey),
    (stockx.url = `https://stockx.com/${stockx.urlKey}`),
    (stockx.media = media),
    (result.stockx = stockx);

  return result;
}

async function getVariants(href) {
  const response = await axios.get(
    `https://stockx.com/api/products/${href}?includes=market`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
      },
      http2: true,
    }
  );
  const { data } = response;

  const products = data.Product.children;
  const keys = Object.keys(products);

  const result = keys.map((key) => {
    const variants = {};
    variants.size = Number(products[key].shoeSize);
    variants.price = products[key].market.lowestAsk;
    return variants;
  });
  return result;
}

module.exports = getInfo;
