const foo = function* () {
  yield "foo";
  yield* bar();
};

const bar = function* () {
  yield "bar";
  yield* baz();
};

const baz = function* () {
  yield "baz";
};

const interator = foo();

for (const index of interator) {
  console.log(index);
  console.log("-----");
}
