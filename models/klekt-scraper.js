const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const key = require("../key.json");

const dataKlekt = require("../data/klekt.json");
puppeteer.use(StealthPlugin());

async function getInfo(keyword) {
  try {
    console.log(keyword);
    puppeteer.launch({ headless: true }).then(async (browser) => {
      const page = await browser.newPage();
      page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
      );

      await page.goto(
        ` https://www.klekt.com/store/pattern, ${keyword} /page,1`
      );

      const href = await page.evaluate(() => {
        return document.querySelector(
          ".k-listing__root.k-product__root.k-product__status-approved > a"
        ).href;
      });

      browser.close();
      // const variants = getVariants(href);
      // variants.then((res) => {
      //   console.log(res);
      // });
    });
    return dataKlekt;
  } catch (error) {
    console.log(error);
  }
}

async function getVariants(href) {
  try {
    const response = await fetch(
      `https://4bgyha3fmu-dsn.algolia.net/1/indexes/dev_products2/46515?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.30.0&x-algolia-application-id=4BGYHA3FMU&x-algolia-api-key=${key.klekt.algolia}`,
      {
        headers: {
          accept: "application/json",
        },
        referrer: href,
        referrerPolicy: "unsafe-url",
        body: null,
        method: "GET",
        mode: "cors",
      }
    );
    const resJson = await response.json();
    const data = resJson.inventory;

    const json = data.map((item) => {
      const product = {};
      product.size = Number(item.size.slice(2));
      product.price = item.price;
      return product;
    });
    const json2 = JSON.stringify(json);

    const dir = "../data/";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.writeFile(`${dir}klekt.json`, json2, (error) => {
      if (error) throw error;
      console.log("KLEKT done");
    });
    return json2;
  } catch (error) {
    console.log(error);
  }
}
module.exports = getInfo;
