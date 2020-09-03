!(function () {
  const generatorFunction = function* () {};
  const iterator = generatorFunction();

  console.log(iterator[Symbol.iterator]);
})();

!(function () {
  const gf = function* () {
    console.log("a");
  };
  console.log(1);
  const iterator = gf();
  console.log(2);
})();
