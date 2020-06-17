function create(subscriber) {
  const observable = {
    subscribe: function (observer) {
      subscriber(observer);
    },
  };

  return observable;
}

const observable = create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
});

const observer = {
  next: function (value) {
    console.log(value);
  },
};

observable.subscribe(observer);
// 1
// 2
// 3

// 问题1: complete 之后应该是不再发送元素的.
// 问题2: 如果缺少 complete 方法, 就会报错.

