// 10-withlatestfrom

const Rx = require('rxjs');
const { zip, withLatestFrom } = require('rxjs/operators');

const main = Rx.from('hello').pipe(zip(Rx.interval(500), (x, y) => x));
const some = Rx.from([0, 1, 0, 0, 0, 1]).pipe(
  zip(Rx.interval(300), (x, y) => x) // 如果这里的300改成1000, 则he二个字符将不会输出.
);

const example = main.pipe(
  withLatestFrom(some, (x, y) => (y === 1 ? x.toUpperCase() : x))
);
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
