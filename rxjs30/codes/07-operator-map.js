// 07-operator-map

const Rx = require('rxjs');

const people = Rx.of('Jerry', 'Anna');

function map(source, callback) {
  return Rx.Observable.create(observer => {
    // return source.subscribe(
    source.subscribe(
      value => {
        try {
          observer.next(callback(value));
        } catch (e) {
          observer.error(e);
        }
      },
      err => observer.error(err),
      () => observer.complete()
    );
  });
}

const helloPeople = map(people, item => item + ' Hello~');
helloPeople.subscribe(console.log);
