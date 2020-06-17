const Observer = require('./26-observer').Observer;

class Observable {
  _subscribe;
  constructor(subscribe) {
    subscribe && (this._subscribe = subscribe);
  }
  subscribe() {
    const observer = new Observer(...arguments);
    this._subscribe(observer);
    return observer;
  }
}
Observable.create = function (subscribe) {
  return new Observable(subscribe);
};

module.exports.Observable = Observable;

// const observable = Observable.create(function (observer) {
//   observer.next(1);
//   observer.next(2);
//   observer.next(3);
//   observer.complete();
//   observer.next('not work');
// });

// const observer = {
//   next: (value) => console.log(value),
//   complete: () => console.log('complete!'),
// };

// observable.subscribe(observer);
