// 12-buffer

const Rx = require('rxjs');
const { bufferTime } = require('rxjs/operators');

const source = Rx.interval(300);
const example = source.pipe(bufferTime(1000));
example.subscribe(console.log);
