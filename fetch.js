const got = require("got");
const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const dataStockx = require("./data/dataStockxApi.json");
const dir = "./data/";

puppeteer.use(StealthPlugin());

async function getData(keyword) {
  await got(
    `https://stockx.com/api/browse?productCategory=sneakers&currency=EUR&_search=%22${keyword}%22&dataType=product`
  )
    .then((response) => response.body)
    .then((data) => {
      fs.writeFile(`${dir}dataStockxApi.json`, data, (error) => {
        if (error) throw error;
        console.log("Job done");
      });
    })
    .then(() => {
      getDataInfo();
      return (href = dataStockx.Products[0].urlKey);
    })
    .then((href) => {
      getVariants(href);
    });

  // const dir = "../data/";
  // fs.mkdir(dir, { recursive: true }, (err) => {
  //   if (err) throw err;
  // });

  // fs.writeFile(`${dir}stockX.json`, json2, (error) => {
  //   if (error) throw error;
  //   console.log("Job done");
  // });
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
  await got(`https://stockx.com/api/products/${href}?includes=market`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15",
    },
    http2: true,
  })
    .then((response) => JSON.parse(response.body))
    .then((data) => {
      const products = data.Product.children;
      for (const key in products) {
        const variants = {};
        variants.size = Number(products[key].shoeSize);
        variants.price = products[key].market.lowestAsk;
        return variants;
      }
    });
  console.log("get variants done");
}
getData("DA3595-100");
