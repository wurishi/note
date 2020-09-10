for (const x of ["a", "b"]) {
  console.log(x);
}

for (const x of "a\uD83D\uDC0A") {
  console.log(x);
}

const map = new Map().set("a", 1).set("b", 2);
for (const pair of map) {
  console.log(pair);
}

const set = new Set().add("a").add("b");
for (const x of set) {
  console.log(x);
}

function printArgs() {
  for (const x of arguments) {
    console.log(x);
  }
}
printArgs("a", "b");

for (const node of document.querySelectorAll("div")) {
  console.log(node);
}

// for (let x of {}) { // TypeError
//   console.log(x);
// }

Object.prototype[Symbol.iterator] = () => {};

const obj = {};
const it1 = obj[Symbol.iterator];
const it2 = Object.create(null)[Symbol.iterator];
console.log(Object.create(null));
console.log(it1, it2);

const arr = [1,2];
const iter = arr[Symbol.iterator]();
arr.push(3);
for(const x of iter) {
  console.log(x);
}
