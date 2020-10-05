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
      console.log(data);
      fs.writeFile(`${dir}dataStockxApi.json`, data, (error) => {
        if (error) throw error;
        console.log("Job done");
      });
    })
    .then(() => {
      getDataInfo();

      const href = `https://stockx.com/${dataStockx.Products[0].urlKey}`;
      getVariants(href);
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

  console.log(product);
}

async function getVariants(href) {
  puppeteer.launch({ headless: false }).then(async (browser) => {
    console.log("Running tests..");
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
    );
    await page.setExtraHTTPHeaders("access-control-allow-origin : *");
    await page.goto(href);

    //Confirm Localisation
    const confirmLocalisation =
      "#root > div.wrapper.css-1yozp93.e1hhn9fb0 > div.page-container.css-1rzs289.e1hhn9fb1 > section > div > div.css-1gxn59a.et9rxoe5";
    const updateLocalisation =
      "#root > div.wrapper.css-1yozp93.e1hhn9fb0 > div.page-container.css-1rzs289.e1hhn9fb1 > section > div";

    await page.waitForSelector(confirmLocalisation || updateLocalisation);
    if (confirmLocalisation) {
      await page.click(
        "#root > div.wrapper.css-1yozp93.e1hhn9fb0 > div.page-container.css-1rzs289.e1hhn9fb1 > section > div > div.css-1gxn59a.et9rxoe5 > button"
      );
    } else {
      await page.click(
        "#root > div.wrapper.css-1yozp93.e1hhn9fb0 > div.page-container.css-1rzs289.e1hhn9fb1 > section > div > img"
      );
    }

    //Accept cookies
    await page.click(
      "#root > div.dialog-wrapper.cookie-dialog > div.dialog-actions > button"
    );

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const lis = await page.evaluate(() => {
      return document.querySelectorAll(".inset.css-8atqhb");

      // return results;
    });
    console.log(lis);

    for (const li of lis) {
      const variants = {};
      variants.size = li.querySelector(".title").innerText;
      variants.price = li.querySelector(".subtitle").innerText;
      return variants;
    }
    console.log(li);

    // await Promise.all([
    //   await page.waitForNavigation(),
    // await page.click("#menu-button-42"),
    // ]);

    // await page.waitForSelector(".chakra-menu__menuitem");

    // const results = await page.$$eval(".chakra-menu__menuitem", (items) => {
    //   return items.map((item) => {
    //     const product = {};
    //     product.size = item.querySelector(".title").innerText;
    //     product.price = item.querySelector(".subtitle").innerText;
    //     return product;
    //   });
    //   return results;
    // });
    browser.close();
  });
}
getData("DA3595-100");
