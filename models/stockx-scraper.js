const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const product = require("../productInfo");

puppeteer.use(StealthPlugin());

async function getInfo() {
  puppeteer.launch({ headless: true }).then(async (browser) => {
    console.log("Running tests..");
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
    );
    await page.setExtraHTTPHeaders("access-control-allow-origin : *");
    await page.goto(product.url);

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

    await Promise.all([
      await page.waitForNavigation(),
      await page.click("#menu-button-42"),
    ]);

    await page.waitForSelector(".chakra-menu__menuitem");

    const results = await page.$$eval(".chakra-menu__menuitem", (items) => {
      return items.map((item) => {
        const product = {};
        product.size = item.querySelector(".title").innerText;
        product.price = item.querySelector(".subtitle").innerText;
        return product;
      });
    });
    browser.close();
    //   console.log(results);
  });
}
module.exports = getInfo;
