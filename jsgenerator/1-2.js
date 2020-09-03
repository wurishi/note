!(function () {
  const gf = function* () {
    console.log("a");
  };
  console.log(1);
  const iterator = gf();
  console.log(2);
  iterator.next();
  console.log(3);
})();

!(function () {
  const gf = function* () {};
  const iterator = gf();
  console.log(iterator.next());
})();

!(function () {
  const gf = function* () {
    yield;
  };
  const iterator = gf();
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
})();

!(function () {
  const gf = function* () {
    let i = 0;
    while (true) {
      yield i++;
    }
  };
  const iterator = gf();
  for (let i = 0; i < 5; i++) {
    console.log(iterator.next());
  }
})();
