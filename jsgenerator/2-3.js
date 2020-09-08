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

makeAjaxCall("http://url1", function (result1) {
  const data = JSON.parse(result1);
  makeAjaxCall("http://url2/?id=" + data.t, function (result2) {
    const resp = JSON.parse(result2);
    console.log(resp);
  });
});

let it;
const cache = {};
function request(url) {
  if (cache[url]) {
    setTimeout(() => {
      it.next(cache[url]);
    }, 0);
  } else {
    makeAjaxCall(url, function (response) {
      cache[url] = response;
      it.next(response);
    });
  }
}
function* main() {
  const result1 = yield request("http://url1");
  const data = JSON.parse(result1);
  const result2 = yield request("http://url2/?id=" + data.t);
  const resp = JSON.parse(result2);
  console.log(resp);
  // yield request("http://url1")
}

it = main();
it.next();
