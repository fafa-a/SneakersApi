const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
puppeteer.use(StealthPlugin());

async function getInfo(keyword) {
  puppeteer.launch({ headless: true }).then(async (browser) => {
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

    getVariants(meta);
    browser.close();
  });
}

async function getVariants(meta) {
  const json = meta.map((item) => {
    const product = {};

    const regex = new RegExp(/^[^-]*[^ -]/g);
    const size = item.public_title;
    const sizeRegExp = regex.exec(size);

    product.size = Number(sizeRegExp[0].slice(3));
    product.price = item.price;

    return product;
  });

  const json2 = JSON.stringify(json);
  
  const dir = "../data/";
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.writeFile(`${dir}/sneakersHeat.json`, json2, (error) => {
    if (error) throw error;
    console.log("Job done");
  });
}
getInfo("CJ0609-300");
