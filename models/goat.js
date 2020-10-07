const data = require("./Untitled-1.json");
console.log(data);
const array = Array.from(data);
console.log(array);
const items = Object.keys(array);

const result = items.map((key) => {
  const variants = {};
  variants.size = array[key].size;
  variants.price = array[key].lowestPriceCents.amount;
  return variants;
});
console.log(result);
