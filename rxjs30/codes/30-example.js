const Rx = require('rxjs');
const { take, share } = require('rxjs/operators');

function cold() {
  const coldSource = Rx.interval(1000) //
    .pipe(take(5));

  coldSource.subscribe((v) => console.log('sub1: ' + v));

  setTimeout(() => {
    coldSource.subscribe((v) => console.log('sub2: ' + v));
  }, 3500);

  // sub1: 0
  // sub1: 1
  // sub1: 2
  // sub1: 3
  // sub2: 0
  // sub1: 4
  // sub2: 1
  // sub2: 2
  // sub2: 3
  // sub2: 4
}

function hot() {
  const hotSource = Rx.interval(1000) //
    .pipe(take(5))
    .pipe(share());

  hotSource.subscribe((v) => console.log('hot1: ' + v));
  setTimeout(() => {
    hotSource.subscribe((v) => console.log('hot2: ' + v));
  }, 3500);

  // hot1: 0
  // hot1: 1
  // hot1: 2
  // hot1: 3
  // hot2: 3
  // hot1: 4
  // hot2: 4
}

// cold();
hot();
