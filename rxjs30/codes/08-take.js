// 08-take

const Rx = require('rxjs');
const take = require('rxjs/operators').take;

const source = Rx.interval(1000);
const example = source.pipe(take(3));
example.subscribe({
  next: console.log,
  complete() {
    console.log('complete');
  }
});
