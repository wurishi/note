const set = new Set().add("a").add("b").add("c");

const [x, y] = set;
console.log(x, y);

const [first, ...rest] = set;
console.log(first, rest);

const obj = { length: 2, 0: "a", 1: "b" };
console.log(Array.from(obj));

!(function () {
  const map = new Map().set(false, "no").set(true, "yes");
  console.log(Array.from(map));
  console.log(Array.from({ length: 3, 0: "a", 2: "c" }));
})();

!(function () {
  const map = new Map().set(false, "no").set(true, "yes");
  console.log(...map);
})();


