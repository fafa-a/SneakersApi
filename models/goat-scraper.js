const fetch = require("isomorphic-fetch");
const axios = require("axios");

// const { mkdir, writeFile } = require("../utils/FS");

// const dir = "../data/";
const key = require("../key.json");

async function getInfo(keyword) {
  try {
    const response = await fetch(
      `https://2fwotdvm2o-dsn.algolia.net/1/indexes/product_variants_v2/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=${key.goat.algolia}`,
      {
        headers: {
          accept: "application/json",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: "https://www.goat.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `{\"params\":\"distinct=true&facetFilters=(product_category%3A%20shoes)%2C%20()&facets=%5B%22size%22%5D&hitsPerPage=48&numericFilters=%5B%5D&page=0&query=${keyword}&clickAnalytics=true\"}`,
        method: "POST",
        mode: "cors",
      }
    );
    const data = await response.json();
    const product = {};
    (product.brandName = data.hits[0].brand_name),
      (product.name = data.hits[0].name),
      (product.sku = data.hits[0].sku),
      (product.href =
        "https://www.goat.com/" +
        data.hits[0].product_type +
        "/" +
        data.hits[0].slug);
    const pathname = data.hits[0].slug;

    const dataGoat = await getVariants(pathname, product);

    return dataGoat;
  } catch (error) {
    console.error(error);
  }
}

async function getVariants(newPathname, product) {
  try {
    const response = await axios.get(
      `https://www.goat.com/web-api/v1/product_variants?productTemplateId=${newPathname}`,
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "User-Agent":
            "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
        },
      }
    );

    const { data } = response;

    const array = Array.from(data);
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

    // mkdir(dir);
    // writeFile(dir, "goat.json", json);
    // console.log("Goat data written");
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}
getInfo("DB4612-300");
module.exports = getInfo;
