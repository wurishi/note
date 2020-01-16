// 14-debouncetime

const Rx = require('rxjs');
const { debounceTime, take } = require('rxjs/operators');

const tmp = Date.now();
const source = Rx.interval(300).pipe(take(5));
const example = source.pipe(debounceTime(1000));
example.subscribe({
  next(value) {
    console.log(value, Date.now() - tmp);
  },
  complete: console.log.bind(console, 'complete')
});
