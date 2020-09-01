const data = [129561, 125433, 97123, 12345];

const result = data
  .map((x) => x / 3)
  .map(Math.floor)
  .map((x) => x - 2)
  .reduce((x, y) => x + y, 0);

console.log(result);
