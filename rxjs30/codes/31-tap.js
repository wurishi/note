const Rx = require('rxjs');
const { tap, map } = require('rxjs/operators');

const source = Rx.interval(1000) //
  .pipe(
    tap((x) => console.log('log: ' + x)),
    map((x) => x + 1)
  );

source.subscribe((x) => console.log(x));
