const got = require("got");
const fs = require("fs");

const dataStockxApi = require("../data/dataStockxApi.json");
const dataStockx = require("../data/stockX.json");
const dir = "../data/";

async function getInfo(keyword) {
  try {
    await got(
      `https://stockx.com/api/browse?productCategory=sneakers&currency=EUR&_search="%22${keyword}%22"&dataType=product`
    )
      .then((response) => response.body)
      .then((data) => {
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) throw err;
        });

        fs.writeFile(`${dir}dataStockxApi.json`, data, (error) => {
          if (error) throw error;
        });
      })
      .then(() => {
        const product = getDataInfo();
        return product;
      })
      .then((product) => {
        const resVariants = getVariants(product.urlKey);
        console.log(product.urlKey);
        resVariants
          .then((variants) => {
            product.variants = variants;
            const jsonProduct = JSON.stringify(product);
            return jsonProduct;
          })
          .then((data) => {
            fs.writeFile(`${dir}stockX.json`, data, (error) => {
              if (error) throw error;
              console.log("Its written");
            });
          });
        console.log("STOCKX done");
      });
    return dataStockx;
  } catch (error) {
    console.log(error);
  }
}

async function getDataInfo() {
  const product = {};

  product.brand = dataStockxApi.Products[0].brand;
  product.gender = dataStockxApi.Products[0].gender;
  product.category = dataStockxApi.Products[0].category;
  product.colorway = dataStockxApi.Products[0].colorway;
  product.thumbnail = dataStockxApi.Products[0].media.thumbUrl;
  product.img = dataStockxApi.Products[0].media.smallImageUrl;
  product.name = dataStockxApi.Products[0].name;
  product.releaseDate = dataStockxApi.Products[0].releaseDate.slice(0, 10);
  product.retailPrice = dataStockxApi.Products[0].retailPrice;
  product.shoe = dataStockxApi.Products[0].shoe;
  product.shortDescription = dataStockxApi.Products[0].shortDescription;
  product.styleId = dataStockxApi.Products[0].styleId;
  product.urlKey = dataStockxApi.Products[0].urlKey;
  product.url = `https://stockx.com/${product.urlKey}`;
  console.log("get info done");

  return product;
}

async function getVariants(href) {
  console.log(href);
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

module.exports = getInfo;
