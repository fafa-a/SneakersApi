const got = require("got");

const { mkdir, writeFile } = require("../utils/FS");
const dir = "../data/";

async function getInfo(keyword) {
  try {
    const response = await got(
      `https://stockx.com/api/browse?productCategory=sneakers&currency=EUR&_search=${keyword}&dataType=product`
    );
    const data = response.body;

    mkdir(dir);
    writeFile(dir, "dataStockX.json", data);

    const product = await getDataInfo(data);
    const variants = await getVariants(product.stockx.urlKey);
    product.stockx.variants = variants;
    const dataStockx = JSON.stringify(product);

    writeFile(dir, "stockX.json", dataStockx);

    console.log("STOCKX done");

    return dataStockx;
  } catch (error) {
    console.log(error);
  }
}
async function getDataInfo(data) {
  const result = {};
  const stockx = {};
  const media = {};
  const dataParsed = JSON.parse(data);

  (media.img = dataParsed.Products[0].media.smallImageUrl),
    (media.thumbnail = dataParsed.Products[0].media.thumbUrl),
    (stockx.brand = dataParsed.Products[0].brand),
    (stockx.category = dataParsed.Products[0].category),
    (stockx.colorway = dataParsed.Products[0].colorway),
    (stockx.gender = dataParsed.Products[0].gender),
    (stockx.name = dataParsed.Products[0].name),
    (stockx.releaseDate = dataParsed.Products[0].releaseDate.slice(0, 10)),
    (stockx.retailPrice = dataParsed.Products[0].retailPrice),
    (stockx.shoe = dataParsed.Products[0].shoe),
    (stockx.shortDescription = dataParsed.Products[0].shortDescription),
    (stockx.styleId = dataParsed.Products[0].styleId),
    (stockx.urlKey = dataParsed.Products[0].urlKey),
    (stockx.url = `https://stockx.com/${stockx.urlKey}`),
    (stockx.media = media),
    (result.stockx = stockx);

  return result;
}
getInfo("AJ4219-400");
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

  return result;
}

module.exports = getInfo;
