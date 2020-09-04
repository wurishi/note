const foo = (name, callback) => {
  setTimeout(() => {
    callback(null, name);
  }, 100);
};
const foo1 = (params, callback) => {
  setTimeout(() => {
    callback(params);
  }, 100);
};

foo("a", (error1, result1) => {
  if (error1) {
    throw new Error(error1);
  }
  foo("b", (error2, result2) => {
    if (error2) {
      throw new Error(error2);
    }
    foo("c", (error3, result3) => {
      if (error3) {
        throw new Error(error3);
      }
      console.log(result1, result2, result3);
    });
  });
});

const curry = (method, ...args) => {
  return (callback) => {
    args.push(callback);
    return method.apply({}, args);
  };
};

const controller = (generator) => {
  const iterator = generator();

  const advancer = (response) => {
    if (response && response.error) {
      return iterator.throw(response.error);
    }
    const state = iterator.next(response);
    if (!state.done) {
      state.value(advancer);
    }
  };
  advancer();
};

controller(function* () {
  let a, b, c;
  try {
    a = yield curry(foo1, "a");
    b = yield curry(foo1, { error: "sth err" });
    c = yield curry(foo1, "c");
  } catch (e) {
    console.log(e);
  }
  console.log(a, b, c);
});
