const Rx = require('rxjs');

const source = Rx.from([1, 2, 3], Rx.asapScheduler);

console.log('before');

source.subscribe((v) => console.log('source:' + v));
setTimeout(() => console.log('settimeout:1'), 0);
setTimeout(() => console.log('settimeout:2'), 0);
setTimeout(() => console.log('settimeout:3'), 0);

console.log('after');