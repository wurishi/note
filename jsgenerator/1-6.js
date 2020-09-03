const gf = function* () {
  yield 1;
  yield 2;
  yield 3;
  return 4;
};

const iterator = gf();
for (const index of iterator) {
  console.log(index);
}
