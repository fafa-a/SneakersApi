import "regenerator-runtime/runtime";
import klekt from "../models/klekt-scraper.js";

const input = document.getElementById("search");
const p = document.getElementById("result");

const search = async function (e) {
  try {
    if (e.keyCode == 13) {
      const { value } = input;
      const res = await klekt(value);
      const { brandName, name, sku, variants } = res.klekt;
      p.innerText = brandName + " " + name + " " + sku;
      for (const item of variants) {
        const { size, price } = item;
        const trSize = document.getElementById("size");
        const trPrice = document.getElementById("price");
        let tdS = document.createElement("td");
        let tdP = document.createElement("td");
        const sizeText = size;
        const priceText = `${price} $`;
        tdS.innerText = sizeText;
        trSize.appendChild(tdS);
        tdP.innerText = priceText;
        trPrice.appendChild(tdP);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("keypress", search);
