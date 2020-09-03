let foo, f;
foo = function* () {
  console.debug("generator 1");
  console.debug("yield 1", yield "A");
  console.debug("generator 2");
  console.debug("yield 2", yield "B");
  console.debug("generator 3");
};

f = foo();

console.log("tick 1");
console.log(f.next("a"));
console.log("tick 2");
console.log(f.next("b"));
console.log("tick 3");
console.log(f.next("c"));
console.log("tick 4");
console.log(f.next("d"));
