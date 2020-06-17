const Observer = require('./26-observer').Observer;

function create(subscriber) {
  const observable = {
    subscribe: function (observerOrNext, error, complete) {
      const realObserver = new Observer(observerOrNext, error, complete);
      subscriber(realObserver);
      return realObserver;
    },
  };

  return observable;
}

const observable = create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
  observer.next('now work');
});

const observer = {
  next: function (value) {
    console.log(value);
  },
  complete: function () {
    console.log('complete!');
  },
};

observable.subscribe(observer);
// 1
// 2
// 3
// complete!