// 15-distinct-flushes

const Rx = require('rxjs');
const { zip, distinct } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'a', 'c']).pipe(
  zip(Rx.interval(300), (x, y) => x)
);
const flushes = Rx.interval(1300);
const example = source.pipe(distinct(null, flushes));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
