function* foo() {
  const x = 1 + (yield "foo");
  console.log(x);
}

const iterator = foo();
console.log(iterator.next());
iterator.next(100);

!(function () {
  const foo = (x) => console.log("x: " + x);

  const bar = function* () {
    yield;
    foo(yield);
  };

  const i = bar();
  i.next();
  i.next();
  i.next(1024);
})();
