const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const got = require("got");
const { mkdir, writeFile } = require("../utils/FS");

const dir = "../data/";

puppeteer.use(StealthPlugin());

async function getInfo(keyword) {
  puppeteer.launch({ headless: true, slowmo: 10 }).then(async (browser) => {
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
    );
    await page.goto(`https://www.goat.com/search?query=${keyword}`);

    //captcha detect ?
    // const text = await page.evaluate(() => {
    //   return document.querySelector("h1").innerText;
    // });
    // console.log(text);

    await page.click(
      "#root > div > div.Dialog__Backdrop-sc-10pvy68-0.kECts.ChangeCurrencyModal__Dialog-sc-17cfdax-0.ezyStG > div > div > button.goat-button.secondary.align-center-justify-center.ChangeCurrencyModal__Button-sc-17cfdax-4.fpAmCQ"
    );

    const product = await page.evaluate(() => {
      const docu = {};
      docu.brandName = document.querySelector(
        ".ProductTemplateGridCell__BrandName-sc-1yrb6b3-1"
      ).innerText;
      docu.name = document.querySelector(
        ".ProductTemplateGridCell__Name-sc-1yrb6b3-2"
      ).innerText;
      docu.sku = document.querySelector(
        ".HiddenInstantSearchBox__Input-sc-1vz7crx-0.kGCnlw"
      ).value;
      docu.href = document.querySelector(".iZedTG > a").href;
      return docu;
    });
    const href = product.href;
    const newPathname = href.slice(30);

    const dataGoat = await getVariants(newPathname, product);
    browser.close();
    console.log("GOAT done");
    return dataGoat;
  });
}

async function getVariants(newPathname, product) {
  try {
    const response = await got(
      `https://www.goat.com/web-api/v1/product_variants?productTemplateId=${newPathname}`
    );

    const data = await response.body;
    const jsonData = JSON.parse(data);

    const array = Array.from(jsonData);
    const items = Object.keys(array);

    const prodVariants = items.map((key) => {
      const variants = {};
      variants.size = array[key].size;
      variants.price = array[key].lowestPriceCents.amount;
      return variants;
    });
    product.variants = prodVariants;

    const result = {};
    result.goat = product;
    const json = JSON.stringify(result);

    mkdir(dir);
    writeFile(dir, "goat.json", json);
    console.log("Goat data written");
    return json;
  } catch (error) {
    console.log(error.response);
  }
}
module.exports = getInfo;
