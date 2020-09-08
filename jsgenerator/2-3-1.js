function makeAjaxCall(url, cb) {
  setTimeout(() => {
    cb(
      JSON.stringify({
        url,
        code: 200,
        t: Date.now(),
      })
    );
  }, 100);
}

function request(url) {
  return new Promise((resolve, reject) => {
    makeAjaxCall(url, resolve);
  });
}

function runGenerator(g) {
  let it = g(),
    ret;
  (function iterate(val) {
    ret = it.next(val);
    if (!ret.done) {
      if ("then" in ret.value) {
        ret.value.then(iterate);
      } else {
        setTimeout(() => iterate(ret.value), 0);
      }
    }
  })();
}

runGenerator(function* () {
  const result1 = yield request("url1");
  const data = JSON.parse(result1);
  const result2 = yield request("url2" + data.t);
  const resp = JSON.parse(result2);
  console.log(resp);

  const search_terms = yield Promise.all([
    request("url1"),
    request("url2"),
    request("url3"),
  ]);
  console.log(search_terms);
});
