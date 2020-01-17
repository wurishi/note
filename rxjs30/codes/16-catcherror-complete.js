// 16-catcherror-complete

const Rx = require('rxjs');
const { zip, catchError, map } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'd', 2]).pipe(
  zip(Rx.interval(500), (x, y) => x)
);
const example = source.pipe(
  map(x => x.toUpperCase()),
  catchError(error => Rx.empty())
);
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
