// 16-repeat

const Rx = require('rxjs');
const { zip, repeat } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c']).pipe(
  zip(Rx.interval(500), (x, y) => x)
);
const example = source.pipe(repeat(1));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
