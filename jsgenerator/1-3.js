const gf = function* () {
  yield "foo";
  return "bar";
  yield "hehe";
};

const iterator = gf();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
