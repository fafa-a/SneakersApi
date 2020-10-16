const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const { mkdir, writeFile } = require("../utils/FS");

puppeteer.use(StealthPlugin());
// const dir = "../data/";

async function getInfo(keyword) {
  try {
    return puppeteer.launch({ headless: true }).then(async (browser) => {
      const page = await browser.newPage();
      page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
      );

      await page.goto(`https://wethenew.com/search?type=product&q=${keyword}*`);

      const href = await page.evaluate(() => {
        return document.querySelector(".product-info__caption").href;
      });

      await page.goto(href);

      const meta = await page.evaluate(() => {
        return meta.product;
      });

      const dataWeTheNew = await getVariants(meta, href);
      browser.close();

      return dataWeTheNew;
    });
  } catch (error) {
    console.error(error);
  }
}

async function getVariants(meta, href) {
  const data = meta.variants;
  const json = data.map((item) => {
    const product = {};
    const size = new RegExp("(?<=-).*?(?=-)");
    const sizeRegExp = size.exec(item.public_title);
    product.size = Number(sizeRegExp[0].trim().slice(0, -2));
    product.price = item.price;
    return product;
  });
  const regex = new RegExp(/^[^-]*[^ -]/g);
  const item = data[0].name;
  const name = regex.exec(item);

  const weTheNew = {};
  weTheNew.brandName = meta.vendor;
  weTheNew.name = name[0];
  weTheNew.sku = data[0].sku;
  weTheNew.href = href;

  weTheNew.variants = json;
  const result = {};
  result.weTheNew = weTheNew;
  // const json2 = JSON.stringify(result);

  // mkdir(dir);

  // writeFile(dir, "weTheNew.json", json2);
  return result;
}
getInfo("DB4612-300");
module.exports = getInfo;
