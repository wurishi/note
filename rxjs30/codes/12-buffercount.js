//12-buffercount

const Rx = require('rxjs');
const { bufferCount } = require('rxjs/operators');

const source = Rx.interval(300);
const example = source.pipe(bufferCount(3));

example.subscribe(console.log);
