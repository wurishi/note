// 08-first
const Rx = require('rxjs');
const first = require('rxjs/operators').first;

const source = Rx.interval(1000);
const example = source.pipe(first());
example.subscribe({
  next: console.log,
  complete() {
    console.log('complete');
  }
});
