// 12-buffer

const Rx = require('rxjs');
const { buffer, take } = require('rxjs/operators');

const source = Rx.interval(300);
const source2 = Rx.interval(1000);
const example = source.pipe(buffer(source2));
example.subscribe(console.log);
