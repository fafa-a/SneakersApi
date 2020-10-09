const fetch = require("isomorphic-fetch");
const { mkdir, writeFile } = require("../utils/FS");
const key = require("../key.json");
const dir = "../data/";

async function getInfo(keyword) {
  const url = "https://www.klekt.com/store/";
  try {
    const response = await fetch(
      `https://4bgyha3fmu-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Breact-instantsearch%204.5.2%3BJS%20Helper%202.26.1&x-algolia-application-id=4BGYHA3FMU&x-algolia-api-key=${key.klekt.algolia}`,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
        referrer: url,
        referrerPolicy: "unsafe-url",
        body: `{"requests":[{"indexName":"dev_products2","params":"query=${keyword}&hitsPerPage=40&maxValuesPerFacet=50&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&filters=inventory.price%20%3E%200%20OR%20nddInventory.price%20%3E%200&facets=%5B%22brand%22%2C%22tags%22%2C%22availableSizes%22%2C%22inventory.price%22%5D&tagFilters="}]}`,
        method: "POST",
        mode: "cors",
      }
    );
    const resJson = await response.json();

    const info = resJson.results[0].hits[0];
    const data = info.inventory;
    const result = {};
    const klekt = {};

    klekt.brandName = info.brand;
    klekt.name = info.title;
    klekt.sku = info.styleCode;
    klekt.href = url + info.uri;

    const json = data.map((item) => {
      const product = {};
      product.size = Number(item.size.slice(2));
      product.price = item.price;
      return product;
    });

    const jsonSorted = json.sort(function (a, b) {
      if (a.size < b.size) {
        return -1;
      }
      if (a.size > b.size) {
        return 1;
      }
      return 0;
    });

    klekt.variants = jsonSorted;
    result.klekt = klekt;
    const dataWrite = JSON.stringify(result);

    mkdir(dir);
    writeFile(dir, "klekt.json", dataWrite);

    return result;
  } catch (error) {
    console.log(error);
  }
}
getInfo("DC9533-001");
module.exports = getInfo;
