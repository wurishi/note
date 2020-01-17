// 15-distinct

const Rx = require('rxjs');
const { zip, distinct } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'a', 'b']).pipe(
  zip(Rx.interval(300), (x, y) => x)
);
const example = source.pipe(distinct());
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
