const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fetch = require("isomorphic-fetch");
const fs = require("fs");

const dataFlightClub = require("../data/flightClub.json");
puppeteer.use(StealthPlugin());

async function getInfo(keyword) {
  puppeteer.launch({ headless: true }).then(async (browser) => {
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15"
    );
    await page.goto(
      `https://www.flightclub.com/catalogsearch/result?query=${keyword}`
    );

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const product = await page.evaluate(() => {
      const docu = {};
      docu.name = document.querySelector("h2").innerText;
      docu.href = document.querySelector(".sc-12ddmbl-0 > a").href;
      return docu;
    });

    await page.click(
      "#__next > div.sc-13z5yif-0.ifdEBU > div > div.sc-1cloqkg-0.dgTZn > div.sc-1wyapo6-1.bNeTMk > div.sc-12ddmbl-0.kEGgBM > a"
    );

    const href = product.href;
    const pathname = product.href.slice(27);

    await page.waitForNavigation({ waitUntil: "networkidle0" });

    const sku = await page.evaluate(() => {
      return document.querySelector("h3.sc-163h2ry-3.jhutSW").innerText;
    });
    const regEx = new RegExp("([^|]+)");
    product.sku = regEx.exec(sku)[0].trim();

    getVariants(href, pathname, product);

    browser.close();
    console.log("FLIGHT CLUB done");
  });
  return dataFlightClub;
}

async function getVariants(href, pathname, product) {
  console.log(product);
  try {
    const response = await fetch("https://www.flightclub.com/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": "XGfcvN3Z-v4Gj_DMpkxHvKyUcQj329J6jVVo",
        cookie:
          "__cfduid=daa2983ca6d496a07a308387fda4bcbe01600874537; __stripe_mid=11d24757-4a2c-4f8d-aed2-f909a80feabdc536e4; _nocache=undefined; _csrf=WNLOAcOHUEDx_4H4EfCe4T_t; __stripe_sid=1b16e74d-17a3-4c1e-a8c4-de84304ec5e4b89815; _xsrf=XGfcvN3Z-v4Gj_DMpkxHvKyUcQj329J6jVVo",
      },
      referrer: href,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"getProductTemplatePricing","variables":{"id":"652901","slug":"${pathname}"},"query":"query getProductTemplatePricing($id: ID!, $slug: String!) {\\n  getProductTemplatePricing(id: $id, slug: $slug) {\\n    isNewInStock\\n    newCount\\n    newHighestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    newLowestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    newSizes {\\n      productTemplateId\\n      size {\\n        value\\n        display\\n        __typename\\n      }\\n      shoeCondition\\n      boxCondition\\n      lowestPriceOption {\\n        price {\\n          value\\n          ...ProductTemplatePriceDisplayParts\\n          __typename\\n        }\\n        isAvailable\\n        __typename\\n      }\\n      instantShipPriceOption {\\n        price {\\n          value\\n          ...ProductTemplatePriceDisplayParts\\n          __typename\\n        }\\n        isAvailable\\n        __typename\\n      }\\n      isInstantShip\\n      __typename\\n    }\\n    sizePickerDefault {\\n      ...SizePickerOptionParts\\n      __typename\\n    }\\n    sizePickerOptions {\\n      ...SizePickerOptionParts\\n      __typename\\n    }\\n    usedLowestPrice {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment ProductTemplatePriceDisplayParts on Price {\\n  display(useGrouping: false, hideEmptyCents: true)\\n  localizedValue\\n  value\\n  __typename\\n}\\n\\nfragment SizePickerOptionParts on SizePickerOption {\\n  size {\\n    display\\n    value\\n    __typename\\n  }\\n  new {\\n    shoeCondition\\n    boxCondition\\n    lowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    instantShipLowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n  used {\\n    shoeCondition\\n    boxCondition\\n    lowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    instantShipLowestPriceCents {\\n      ...ProductTemplatePriceDisplayParts\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n"}`,
      method: "POST",
      mode: "cors",
    });
    const resJson = await response.json();
    const data = resJson.data.getProductTemplatePricing.newSizes;

    const json = data.map((item) => {
      const product = {};
      product.size = item.size.value;
      product.price = item.lowestPriceOption.price.value;
      return product;
    });
    product.variants = json;

    const dataJson = {};
    dataJson.flightClub = product;
    console.log(dataJson);
    const dataWrite = JSON.stringify(dataJson);

    const dir = "../data/";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.writeFile(`${dir}flightClub.json`, dataWrite, (error) => {
      if (error) throw error;
      console.log("Job done");
    });
    return dataWrite;
  } catch (error) {
    console.log(error);
  }
}
getInfo("CV1639-001");
module.exports = getInfo;
