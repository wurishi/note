const Rx = require('rxjs');
const { take, map, share } = require('rxjs/operators');

// random 会被执行多次
// const result = Rx.interval(1000) //
//   .pipe(take(6))
//   .pipe(map((x) => Math.random()));

// random 只会被执行一次
const result = Rx.interval(1000) //
  .pipe(take(6))
  .pipe(map((x) => Math.random()))
  .pipe(share());

const subA = result.subscribe((x) => console.log('A: ' + x));
const subB = result.subscribe((x) => console.log('B: ' + x));
