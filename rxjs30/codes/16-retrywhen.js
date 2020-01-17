// 16-retrywhen

const Rx = require('rxjs');
const { zip, map, retryWhen, delay } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'd', 2]).pipe(
  zip(Rx.interval(500), (x, y) => x)
);
const example = source.pipe(
  map(x => x.toUpperCase()),
  retryWhen(errorObs => {
    return errorObs.pipe(
      delay(1000),
      map(err => console.log('fetch: ' + err))
    );
  })
);
example.subscribe(console.log);
