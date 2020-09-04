const foo = (name, callback) => {
  setTimeout(() => {
    callback(name);
  }, 100);
};

foo("a", (a) => {
  foo("b", (b) => {
    foo("c", (c) => {
      console.log(a, b, c);
    });
  });
});

const controller = (generator) => {
  const iterator = generator();
  const advancer = (response) => {
    const state = iterator.next(response);
    if (!state.done) {
      state.value(advancer);
    }
  };
  advancer();
};

const curry = (method, ...args) => {
  return (callback) => {
    args.push(callback);
    return method.apply({}, args);
  };
};

controller(function* () {
  const a = yield curry(foo, "a");
  const b = yield curry(foo, "b");
  const c = yield curry(foo, "c");
  console.log(a, b, c);
});
