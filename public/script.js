import "regenerator-runtime/runtime";
import klekt from "../models/klekt-scraper.js";

const input = document.getElementById("search");
const p = document.getElementById("result");

const search = async function (e) {
  if (e.keyCode == 13) {
    const { value } = input;
    console.log(value);
    const res = await klekt(value);
    const { brandName, name, sku, variants } = res.klekt;
    p.innerText = brandName + " " + name + " " + sku;
    // variants.map((item) => {
    for (const item of variants) {
      const { size, price } = item;

      const result = `<tr>
        <td>${size}</td>
      </tr>
      <tr>
        <td>${price}</td>
      </tr>
      `;
      console.log(result);
      document.getElementById("variants").innerHTML = result;
    }
  }
};

document.addEventListener("keypress", search);
