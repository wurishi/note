// 16-retry
const Rx = require('rxjs');
const { zip, map, retry } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'd', 2]).pipe(
  zip(Rx.interval(500), (x, y) => x)
);
const example = source.pipe(
  map(x => x.toUpperCase()),
  retry(1)
);
example.subscribe(
  value => console.log(value),
  error => console.log('Error: ' + error),
  () => console.log('complete')
);
