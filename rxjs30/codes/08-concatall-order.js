// 08-concatall-order
const Rx = require('rxjs');
const concatAll = require('rxjs/operators').concatAll;
const take = require('rxjs/operators').take;

const obs1 = Rx.interval(1000).pipe(take(5));
const obs2 = Rx.interval(500).pipe(take(2));
const obs3 = Rx.interval(2000).pipe(take(1));

const source = Rx.of(obs1, obs2, obs3);
const example = source.pipe(concatAll());
example.subscribe({
  next: console.log,
  complete() {
    console.log('complete');
  }
});
