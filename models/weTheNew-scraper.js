const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
puppeteer.use(StealthPlugin());

const dataWeTheNew = require("../data/weTheNew.json");
async function getInfo(keyword) {
  puppeteer.launch({ headless: true }).then(async (browser) => {
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
    );
    await page.setExtraHTTPHeaders({
      accept: "*/*",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    });
    await page.goto(`https://wethenew.com/search?type=product&q=${keyword}*`);

    await page.click(".thumbnail-overlay");

    await page.waitForSelector(".ButtonGroup__ButtonGroupStyle-sc-1usw1pe-1");

    const meta = await page.evaluate(() => {
      return meta.product.variants;
    });

    getVariants(meta);
    browser.close();
  });
  console.log("WE THE NEW done");
  return dataWeTheNew;
}

async function getVariants(meta) {
  const json = meta.map((item) => {
    const product = {};
    const size = new RegExp("(?<=-).*?(?=-)");
    const sizeRegExp = size.exec(item.public_title);

    product.size = Number(sizeRegExp[0].trim().slice(0, -2));
    product.price = item.price;

    return product;
  });
  const json2 = JSON.stringify(json);

  const dir = "../data/";
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.writeFile(`${dir}/weTheNew.json`, json2, (error) => {
    if (error) throw error;
    console.log("Job done");
  });
}
getInfo("DC9533-001");
module.exports = getInfo;
