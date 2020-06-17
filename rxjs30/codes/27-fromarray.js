const Observable = require('./27-observable').Observable;

Observable.fromArray = function (array) {
  if (!Array.isArray(array)) {
    throw new Error('传入的参数必须是数组');
  }
  return new Observable(function (observer) {
    try {
      array.forEach((value) => observer.next(value));
      observer.complete();
    } catch (error) {
      observer.error(error);
    }
  });
};

const observable = Observable.fromArray([1, 2, 3, 4, 5]);
observable.subscribe(
  (value) => {
    console.log(value);
  },
  null,
  () => console.log('complete')
);
