function* gf() {
  console.log(yield);
}

const iterator = gf();

iterator.next("foo");
iterator.next("bar");
