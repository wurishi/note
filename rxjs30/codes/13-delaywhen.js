// 13-delaywhen

const Rx = require('rxjs');
const { delayWhen, delay, take } = require('rxjs/operators');

const source = Rx.interval(300).pipe(take(5));
const example = source.pipe(
  delayWhen(x => {
    console.log('delayWhen ' + x + ' :', 100 * x * x);
    return Rx.empty().pipe(delay(100 * x * x));
  })
);
let tmp = Date.now();
example.subscribe({
  next(value) {
    console.log(value, Date.now() - tmp);
    tmp = Date.now();
  },
  complete: console.log.bind(console, 'complete')
});
