# 1: JavaScript Generators 权威指南

[参考资料](https://github.com/gajus/gajus.com-blog/blob/master/posts/the-definitive-guide-to-the-javascript-generators/index.md)

## 1-1. 创建 Generator Function

```javascript
const generatorFunction = function* () {}; // 注意*
```

还需要配合 Iterator 使用

```javascript
const iterator = generatorFunction();

console.log(iterator[Symbol.iterator]); // [Function: [Symbol.iterator]]
```

要注意的是, 获得了 Iterator 并不代表 Generator Function 执行了.

```javascript
const gf = function* () {
    console.log("a");
};
console.log(1);
const iterator = gf();
console.log(2);
// 1
// 2
// log a 并不会被执行
```

## 1-2. 使用 Generator Function

使用 `next()` 方法可以让 generator 方法开始**前进**(*注意不是执行*!!!)

```javascript
const gf = function* () {
    console.log("a");
};
console.log(1);
const iterator = gf();
console.log(2);
iterator.next();
console.log(3);
// 1
// 2
// a
// 3
```

`next()` 方法返回一个描述当前迭代(iterator)进度的对象.

```javascript
const gf = function* () {};
const iterator = gf();
console.log(iterator.next());
// { value: undefined, done: true }
```

`done` 属性用来描述生成器方法(Generator Function)体中的代码是否已经全部执行完成了.

```javascript
const gf = function* () {
    yield;
};
const iterator = gf();
console.log(iterator.next()); // { value: undefined, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

生成器方法支持关键字 `yield`, `yield` 支持让生成器方法执行一部分(所以前面称`next()`为**前进**), 然后返回一个值. 只有方法全部执行完成了, 返回对象中的 `done` 才会是 true.

```javascript
const gf = function* () {
    let i = 0;
    while (true) { // 虽然这里是死循环, 但 generator function 其实并不会阻塞线程, 在yield处会等待下次 iterator.next() 的调用.
        yield i++;
    }
};
const iterator = gf();
for (let i = 0; i < 5; i++) {
    console.log(iterator.next());
}
// { value: 0, done: false }
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: 4, done: false }
```

## 1-3. 将值传递给迭代器

`yield` 关键字可以传递给迭代器任意类型, 包括 function, number, array 和 object.

也可以使用 `return` 结束生成器函数. 注意 `return` 也可以将值传递给迭代器.

```javascript
const gf = function* () {
  yield "foo";
  return "bar";
  yield "hehe";
};

const iterator = gf();
console.log(iterator.next()); // { value: 'foo', done: false }
console.log(iterator.next()); // { value: 'bar', done: true }
console.log(iterator.next()); // { value: undefined, done: true }
// 注意 return 之后的代码将不再会执行
// return 的值只会拿到一次, 后续调用 next(), value 是 undefined
```

## 1-4. 从迭代器接收数据

`yield`关键也可以接收到每次迭代器执行 `next` 时传递的参数.

```javascript
function* gf() {
  console.log(yield);
}

const iterator = gf();

iterator.next("foo");
iterator.next("bar");
// bar
```

要注意的是第一次的参数 'foo' `yield`并没有接收到, 第一个参数始终会被丢弃(tossed-away).

## 1-5. 理解执行流程

```javascript
let foo, f;
foo = function* () {
  console.debug("generator 1");
  console.debug("yield 1", yield "A");
  console.debug("generator 2");
  console.debug("yield 2", yield "B");
  console.debug("generator 3");
};

f = foo();

console.log("tick 1");
console.log(f.next("a"));
console.log("tick 2");
console.log(f.next("b"));
console.log("tick 3");
console.log(f.next("c"));
console.log("tick 4");
console.log(f.next("d"));
```

执行结果为:

| 打印结果                       | 原因                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| tick 1                         | main console.log('tick 1')                                   |
| generator 1                    | *f 执行了第一个console.debug                                 |
| {value: 'A', done: false}      | *f 中断在了console.debug("yield 1"), 因为 yield 它先把 'A' 返回给迭代器了, 所以 main 的 console.log(f.next("a")) 执行了 |
| tick 2                         |                                                              |
| yield 1 b                      | 因为 f.next('b') 执行后, 先触发了 *f 的第二行 debug, 此时 yield 接收到了 'b' |
| generator 2                    |                                                              |
| {value: 'B', done: false}      | 显示在*f 的第四行执行时中断了, 先把 'B' 传递给了迭代器       |
| tick3                          |                                                              |
| yield 2 c                      | 执行 f.next('c') 时, *f 的 yield 拿到 'c' 了                 |
| generator 3                    |                                                              |
| {value: undefined, done: true} | *f 已经全部执行完了.                                         |
| tick 4                         |                                                              |
| {value: undefined, done: true} | 此是 *f 已经早就执行结果了.                                  |

## 1-6. 使用`for...of`遍历迭代器

生成器函数返回的迭代器是符合 iterable 协议的, 也就是说可以直接使用 `for...of` 表达式遍历它.

```javascript
const gf = function* () {
  yield 1;
  yield 2;
  yield 3;
  return 4;
};

const iterator = gf();
for (const index of iterator) {
  console.log(index);
}
// 1
// 2
// 3
```

- 只要 `done` 为 `false`, 遍历将会继续.
- 如果需要将数据传递给生成器函数, `for...of` 并不适用这种场景.
- `for...of` 将始终丢弃 `return` 返回的值.

## 1-7. 委托 yield

yield* 可以委托给其他的生成器.

```javascript
const foo = function* () {
  yield "foo";
  yield* bar();
};

const bar = function* () {
  yield "bar";
  yield* baz();
};

const baz = function* () {
  yield "baz";
};

const interator = foo();

for (const index of interator) {
  console.log(index);
  console.log("-----");
}
// foo
// -----
// bar
// -----
// baz
// -----
```

## 1-8. Throw

除了使用`next()`推进生成器函数的执行之外, 也可以使用throw(). 抛出的错误将会被传进生成器函数, 也就是说你可以自由选择是在生成器函数的内部还是外部处理错误.

```javascript
const gf = function* () {
  while (true) {
    try {
      yield;
    } catch (e) {
      if (e != "a") {
        throw e;
      }
      console.log("Generator内部处理", e);
    }
  }
};

const iterator = gf();
iterator.next();

try {
  iterator.throw("a");
  iterator.throw("b");
} catch (e) {
  console.log("未在Generator处理的错误", e);
}
// Generator内部处理 a
// 未在Generator处理的错误 b
```

和 yield 同样的你可以抛出任何类型的错误, 包括 function, number, array 和 object.

## 1-9. 生成器函数的使用场景1

在 JavaScript 中, I/O 操作通常都是异步的, 一般都需要一个 callback 在操作完成后处理后续功能, 举个例子:

```javascript
const foo = (name, callback) => {
  setTimeout(() => {
    callback(name);
  }, 100);
};
```

如果需要连续执行异步方法, 代码往往会写成这样:

```javascript
foo("a", (a) => {
  foo("b", (b) => {
    foo("c", (c) => {
      console.log(a, b, c);
    });
  });
});
```

这就是臭名昭著的回调地狱.

要解决这类问题, 解决方法就是使用 Promise(async/await) 或者生成器函数.

[代码](1-9.js)

```javascript
controller(function* () {
  const a = yield curry(foo, "a");
  const b = yield curry(foo, "b");
  const c = yield curry(foo, "c");
  console.log(a, b, c);
});
```

## 1-10. 生成器函数的使用场景2 (错误处理)

如果要处理异步方法的错误, 通常是这样写的:

```javascript
const foo = (name, callback) => {
  callback(null, name);
};

foo("a", (error1, result1) => {
  if (error1) {
    throw new Error(error1);
  }
  foo("b", (error2, result2) => {
    if (error2) {
      throw new Error(error2);
    }
    foo("c", (error3, result3) => {
      if (error3) {
        throw new Error(error3);
      }
      console.log(result1, result2, result3);
    });
  });
});
```

如果有 1-9 的生成器函数处理, 只需要在统一的位置加 `try...catch` 即可.

```javascript
const curry = (method, ...args) => {
  return (callback) => {
    args.push(callback);
    return method.apply({}, args);
  };
};

const controller = (generator) => {
  const iterator = generator();

  const advancer = (response) => {
    if (response && response.error) { // 发现错误用迭代器抛出
      return iterator.throw(response.error);
    }
    const state = iterator.next(response);
    if (!state.done) {
      state.value(advancer); // 执行curry返回的method
    }
  };
  advancer();
};

controller(function* () {
  let a, b, c;
  try { // 加 try/catch 统一处理任务
    a = yield curry(foo1, "a");
    b = yield curry(foo1, { error: "sth err" });
    c = yield curry(foo1, "c");
  } catch (e) {
    console.log(e);
  }
  console.log(a, b, c);
});
```

