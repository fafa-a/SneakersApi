const fetch = require("isomorphic-fetch");
// const fs = require("fs");

const key = require("../key.json");

async function getInfo(keyword) {
  try {
    const response = await fetch(
      `https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(5.7.0)%3B%20JS%20Helper%20(2.28.1)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=${key.flightClub.algolia}`,
      {
        headers: {
          accept: "application/json",
          "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: "https://www.flightclub.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `{"requests":[{"indexName":"product_variants_v2_flight_club","params":"query=${keyword}&hitsPerPage=30&maxValuesPerFacet=40&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&distinct=true&filters=&facets=%5B%22brand_name%22%2C%22silhouette%22%2C%22presentation_size%22%2C%22size_us_men%22%2C%22size_us_women%22%2C%22size_us_youth%22%2C%22shoe_condition%22%2C%22color%22%2C%22single_gender%22%2C%22category%22%2C%22product_category%22%2C%22designer%22%2C%22collection_slugs%22%2C%22is_under_retail%22%2C%22lowest_price_cents_usd%22%2C%22release_year%22%5D&tagFilters="}]}`,
        method: "POST",
        mode: "cors",
      }
    );
    const dataRaw = await response.json();
    const data = dataRaw.results[0].hits[0];
    const product = {};
    (product.brandName = data.brand_name),
      (product.name = data.name),
      (product.sku = data.sku),
      (product.href = "https://www.flightclub.com/" + data.slug);
    const pathname = data.slug;
    const href = product.href;
    const dataFlightClub = await getVariants(href, pathname, product);

    return dataFlightClub;
  } catch (error) {
    console.error(error);
  }
}

async function getVariants(href, pathname, product) {
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

    const dataWrite = JSON.stringify(dataJson);

    // const dir = "../data/";
    // fs.mkdir(dir, { recursive: true }, (err) => {
    //   if (err) throw err;
    // });

    // fs.writeFile(`${dir}flightClub.json`, dataWrite, (error) => {
    //   if (error) throw error;
    //   console.log("Job done");
    // });
    return product;
  } catch (error) {
    console.error(error);
  }
}

module.exports = getInfo;
