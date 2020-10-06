const got = require("got");
const fs = require("fs");

const dataStockx = require("../data/dataStockxApi.json");
const dir = "./data/";

async function getData(keyword) {
  await got(
    `https://stockx.com/api/browse?productCategory=sneakers&currency=EUR&_search=%22${keyword}%22&dataType=product`
  )
    .then((response) => response.body)
    .then((data) => {
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

      resVariants.then((variants) => {
        product.variants = variants;
        const jsonProduct = JSON.stringify(product);

        const dir = "./data/";
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) throw err;
        });

        fs.writeFile(`${dir}stockX.json`, jsonProduct, (error) => {
          if (error) throw error;
          console.log("Its written");
        });
      });
    });
}

async function getDataInfo() {
  const product = {};

  product.brand = dataStockx.Products[0].brand;
  product.gender = dataStockx.Products[0].gender;
  product.category = dataStockx.Products[0].category;
  product.colorway = dataStockx.Products[0].colorway;
  product.thumbnail = dataStockx.Products[0].media.thumbUrl;
  product.img = dataStockx.Products[0].media.smallImageUrl;
  product.name = dataStockx.Products[0].name;
  product.releaseDate = dataStockx.Products[0].releaseDate.slice(0, 10);
  product.retailPrice = dataStockx.Products[0].retailPrice;
  product.shoe = dataStockx.Products[0].shoe;
  product.shortDescription = dataStockx.Products[0].shortDescription;
  product.styleId = dataStockx.Products[0].styleId;
  product.urlKey = dataStockx.Products[0].urlKey;
  product.url = `https://stockx.com/${product.urlKey}`;
  console.log("get info done");
  return product;
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
getData("DA3595-100");
