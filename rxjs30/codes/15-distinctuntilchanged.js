// 15-distinctuntilchanged

const Rx = require('rxjs');
const { zip, distinctUntilChanged } = require('rxjs/operators');

const source = Rx.from(['a', 'b', 'c', 'c', 'b']).pipe(
  zip(Rx.interval(300), (x, y) => x)
);
const example = source.pipe(distinctUntilChanged());
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
