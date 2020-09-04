const gf = function* () {
  while (true) {
    try {
      yield;
    } catch (e) {
      if (e != "a") {
        throw e;
      }
      console.log("Generator内部处理", e);
    }
  }
};

const iterator = gf();
iterator.next();

try {
  iterator.throw("a");
  iterator.throw("b");
} catch (e) {
  console.log("未在Generator处理的错误", e);
}
