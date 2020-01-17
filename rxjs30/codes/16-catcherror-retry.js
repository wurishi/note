// 16-catcherror-retry

const Rx = require('rxjs');
const { zip, map, catchError } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'd', 2]).pipe(
  zip(Rx.interval(500), (x, y) => x)
);
const example = source.pipe(
  map(x => x.toUpperCase()),
  catchError((error, obs) => obs)
);
example.subscribe(console.log);
