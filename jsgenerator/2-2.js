function* foo() {
  let x = yield 3;
  console.log(x);
  x = yield 4;
  console.log(x);
}

function* bar() {
  yield 1;
  yield 2;
  yield* foo();
  yield 5;
}

for (const v of bar()) {
  console.log(v);
}

const it = bar();
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next("x hehe"));

!(function () {
  console.log("---------------");
  function* foo() {
    yield 2;
    yield 3;
    return "foo";
  }

  function* bar() {
    yield 1;
    const v = yield* foo();
    console.log("v: " + v);
    yield 4;
  }

  for (const v of bar()) {
    console.log(v);
  }
})();

!(function () {
  console.log("--------------");

  function* foo() {
    try {
      yield 2;
    } catch (error) {
      console.log("foo caught: " + error);
    }
    yield 3;
    throw "Oops!";
  }

  function* bar() {
    yield 1;
    try {
      yield* foo();
    } catch (error) {
      console.log("bar caught: " + error);
    }
  }

  const it = bar();

  console.log(it.next()); // {value: 1, done: false}
  console.log(it.next()); // {value: 2, done: false}

  console.log(it.throw("Uh oh!")); // foo caught: Uh oh!
  // {value: 3, done: false}

  console.log(it.next()); // bar caught: Oops!
  // {value: undefined, done: true}
})();
