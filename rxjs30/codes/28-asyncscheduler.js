const Rx = require('rxjs');

const source = Rx.from([1, 2, 3], Rx.asyncScheduler);

console.log('before');

source.subscribe((v) => console.log('source:' + v));

let index = 0;
let t = setInterval(() => {
  console.log('interval:' + ++index);
  if (index >= 3) {
    clearInterval(t);
  }
}, 0);

console.log('after');
