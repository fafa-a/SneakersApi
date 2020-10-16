const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { mkdir, writeFile } = require("../utils/FS");
// const dir = "../data/";

puppeteer.use(StealthPlugin());

async function getInfo(keyword) {
  try {
    return puppeteer.launch({ headless: true }).then(async (browser) => {
      const page = await browser.newPage();
      page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
      );
      await page.goto(
        `https://sneakers-heat.com/search?q=${keyword}*&type=product`
      );

      const href = await page.evaluate(() => {
        return document.querySelector(
          ".ProductItem__ImageWrapper.ProductItem__ImageWrapper--withAlternateImage"
        ).href;
      });

      await page.goto(href);

      const meta = await page.evaluate(() => {
        return meta.product.variants;
      });

      const dataSneakersHeat = await getVariants(meta, href);
      browser.close();

      return dataSneakersHeat;
    });
  } catch (error) {
    console.eror(error);
  }
}

async function getVariants(meta, href) {
  const styleCode = meta[0].sku;
  const title = meta[0].name;
  const RegExsku = new RegExp(".*(?=-)");
  const RegExName = new RegExp(".+?(?=-)");
  const skuRegEx = RegExsku.exec(styleCode);
  const nameRegEx = RegExName.exec(title);
  const sku = skuRegEx[0];
  const name = nameRegEx[0];
  const brandName = name.toLowerCase();

  const result = {};
  const sneakersHeat = {};

  const searchName = function () {
    if (brandName.includes("air jordan")) {
      sneakersHeat.brand = "Air Jordan";
    } else if (brandName.includes("nike")) {
      sneakersHeat.brand = "Nike";
    } else if (brandName.includes("adidas")) {
      sneakersHeat.brand = "Adidas";
    } else if (brandName.includes("yeezy")) {
      sneakersHeat.brand = "Yeezy";
    } else if (brandName.includes("reebok")) {
      sneakersHeat.brand = "Reebok";
    } else if (brandName.includes("converse")) {
      sneakersHeat.brand = "Converse";
    }
    return sneakersHeat.brand;
  };

  sneakersHeat.brand = searchName();
  sneakersHeat.name = name;
  sneakersHeat.sku = sku;
  sneakersHeat.href = href;

  const json = meta.map((item) => {
    const product = {};
    const regex = new RegExp(/^[^-]*[^ -]/g);
    const size = item.public_title;
    const sizeRegExp = regex.exec(size);

    product.size = Number(sizeRegExp[0].slice(3));
    product.price = item.price;

    return product;
  });
  sneakersHeat.variants = json;
  result.sneakersHeat = sneakersHeat;

  // const json2 = JSON.stringify(result);

  // mkdir(dir);
  // writeFile(dir, "sneakersHeat.json", json2);
  return result;
}
getInfo("DB4612-300");
module.exports = getInfo;
