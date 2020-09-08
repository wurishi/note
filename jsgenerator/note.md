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

# 2: ES6 Generators

[参考资料](https://davidwalsh.name/es6-generators)

## 2-1. ES6 Generators 基础

ES6 中最激动人心的新功能之一就是 Generator.

### 运行到完成

通常情况下 JavaScript 的函数一旦开始运行, 只有在他运行完成后其他的 JS 代码才能开始运行. 比如:

```javascript
setTimeout(function() {
    console.log('Hello World');
}, 1);

function foo() {
    // 真实情况下永远不要这么做
    for(let i=0; i<=1E10; i++) {
        console.log(i);
    }
}
foo();
// 0...1E10
// Hello World
```

以上代码里, `for` 循环需要花费相当长的时间才能完成 (肯定大于1毫秒), 所以 `setTimeout` 的代码只能等待 `foo()` 函数运行完成后才能执行.

如果想让代码按理解的顺序运行, 则 `foo()` 必须能够被打断, 即让 `setTimeout` 在 `foo()` 执行过程中运行. 但这又会带来其他多线程编程面临的问题.

不过, JS 始终是单线程的.(即在任何给定时间仅执行一个命令或函数)

> 注意: Web Workers 是一种多线程机制, 但它不会给我们带来多线程的复杂性. 因为 Web Workers 与 JS 主线程之间只能通过异步事件互相通信, 而异步事件始终遵守着运行时要求的事件循环必须遍历完成的规则.

### 运行...停止...运行

ES6 Generators 不同于普通的 function, 它允许我们在 Generators 中暂停一次或者多次, 然后再需要时再恢复. 其中其他代码可以在暂停期间运行的.

如果了解过有关并发或多线程的资料, 那么可能会看到**"合作(cooperative)"**这一词. 它的意思大致是表示一个进程(在 JS 中是一个函数)自己可以选择在什么时候中断, 以便于它能和其他代码合作. 这个概念和"**抢先式(preemptive)**"形成先明的对比, "抢先式"表示功能可能在其自己意想不到的时候被中断.

ES6 Generators 的并发行为是合作式的. 在ES6 Generators 函数中, 可以使用一个新关键字 `yield` 从内部暂停自己的执行. 要注意的是, 并没有其他方式从 Generators 外部暂停它, 唯一的方式就是在内部用 `yield` 暂停.

另外, 一旦使用 `yield` 暂停了 Generators, 函数自身将没有办法让自己恢复执行. 恢复执行的唯一途径是使用函数外部的一个控制器.

可以这样说 Generators 函数可以随时暂停随时重新启动, 且次数不限. 因此在实际使用时你甚至可以在 Generators 中使用无限循环(即 `while(true) {...}`). 这种用法在普通的 JS 程序中基本上是不会使用的, 但在 Generators 函数中, 它是合理的操作.

更重要的是, 这种停止和再次执行并不仅仅是针对 Generators 函数执行的控制, 还能使用双路消息(2-way)发送与接受数据. 例如使用普通函数, 可以在函数的开头获取参数, 在结尾用 `return` 返回值. 使用 Generators 可以在每次 `yield` 时获取消息(返回值), 并在每次重新启动时发送消息(传参数).

### 语法

Generators 声明语法:

```javascript
function * foo() {
    // ...
}
```

`*` 就是与普通 function 的不同之处, 它看起来有些奇怪. 对于其他语言而言, 它看起来很像函数的返回值指针, 但在 JS 中它只是表明这是一个 Generators 函数的方式而已.

> 注意: `function* foo() {}` 和 `function *foo() {}` (注意 `*` 位置有所不同) 两者都是有效的.

然后开始考虑 Generators 函数的内容. 在大多数时候, Generators 函数只是普通的 JS 函数. 在函数内部几乎没有什么新语法需要学习. (即, 之前学习的几乎所有 JS 内容都是可以在 Generators 函数内部使用的)

Generators 函数中唯一的新内容就是新的关键字 `yield`, 要注意的是 `yield` 准确来说应该称其为 "`yield` 表达式" (而不是语句). 这是因为, 当重新启动 Generators 时, 我们可以向其发送一个值, 而发送的任何内容其实都是 `yield` 表达式的执行结果.

举个例子:

```javascript
function *foo() {
    let x = 1 + (yield 'foo'); // yield 表达式接收到 100, 执行 1+100
    console.log(x); // 101
}

const iterator = foo();
console.log(iterator.next()); // { value: 'foo', done: false }
iterator.next(100); // 100 发送给 *foo
```

`yield 'foo'` 表达式会在 Generators 第一次暂停时发送字符串 `'foo'` (`iterator.next()` 的返回值中的`value`). 当 Generators 在任意时间被重新启动时, 可以再发送一个任意值给 Generators, 在 Generators 内部这个值将会与 1 相加并赋值给 `x`.

这就是两路通讯(2-way communication), 将值 `'foo'` 发送出去并暂停自己. 然后在某个时刻 (可能是立即, 也可能是很久以后), Generators 将重新启动并提供一个值. 这个值就像 `yield` 关键字的请求值一样.

可以在任意表达式的位置使用 yield, 如果不指定发送的值, yield 默认会接收一个 `undefined`.

```javascript
const foo = (x) => console.log("x: " + x);

const bar = function* () {
    yield;
    foo(yield);
};

const i = bar();
i.next();
i.next();
i.next(1024); // 如果不传值, 会打印 x: undefined
// x: 1024
```

### Generator Iterator

迭代器(Iterator)是一种特殊的行为, 它其实上属于一种设计模式. 通过调用 `next()` 来遍历一组有序的值.

例如在数组 `[1,2,3,4,5]`上使用迭代器, 第一次调用 `next()` 将返回 `1`, 第二次调用 `next()` 返回 `2`, 以此类推. 返回所有值后, 调用 `next()` 将返回 `null` 或 `false`, 通知你已经遍历了数据容器中所有的值.

从外部控制 Generator 功能使用的就是迭代器, 迭代器负责与 Generator 交互. 举个简单的例子:

```javascript
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
}
```

怎样一步步获取到 foo 生成器函数的值呢? 使用迭代器.

```javascript
const it = foo();
```

**需要特别注意的是, 这里并不像普通函数那样, foo() 并没有执行foo**

如果需要执行生成器函数(foo), 需要执行以下操作:

```javascript
const message = it.next();
```

这将让 foo 执行到 `yield 1` 并暂停, 但这并不是我们唯一得到的内容.

```javascript
console.log(message); // {value: 1, done: false}
```

实际上, 每次调用 `next()`, 我们都会获得一个对象, 对象里面有一个属性 `value`, 表示 `yield` 返回的值, 另外还有一个布尔类型的属性 `done` 表示生成器函数是否全部执行完成.

继续执行迭代:

```javascript
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: 3, done: false}
console.log(it.next()); // {value: 4, done: false}
console.log(it.next()); // {value: 5, done: false}
```

要注意的是, 当 `value` 为 `5` 时, `done` 仍然是 `false`. 这是因为从技术上来讲, 生成器的功能并没有完全结束. 我们仍然可以调用 `next()`, 如果此时我们发送了一个值, 那么 `yield 5` 表达式的结果就是发送的这个值. 只有这样操作了以后, 生成器的功能才算完全结束.

因此:

```javascript
console.log(it.next()); // {value: undefined, done: true}
```

此时生成器函数的结果表示函数已经执行完成了(done: true), 但是 value 没有任何数据, 因为此时已经用了所有的 `yield` 语句.

你可能会想到 `return` 是否能在生成器函数中使用, 如果可以 return 的值是否有通过 value 发送出去?

```javascript
function *foo() {
    yield 1;
    return 2;
}
const it = foo();
console.log(it.next()); // {value: 1, done: false}
consoel.log(it.next()); // {value: 2, done: true}
```

看起来使用 return 也是可以的, 但这并不是一个好主意. 因为当我们使用 `for...of` 循环遍历迭代器时, 最终 return 的值将被丢弃.

#### for...of

ES6 提供了遍历迭代器的完整语法支持: `for...of`

```javascript
function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}
let v;
for(v of foo()) {
    console.log(v);
}
// 1 2 3 4 5
console.log(v); // 仍然是5而不是6
```

`foo...of`会自动创建迭代器来遍历 `foo()`, 遍历将直到迭代器的 `done: true` 时才会结束. 只要 `done` 是 `false`, 它就会自动提取 `value` 属性并分配给迭代变量(这里指的是 `v`).

要注意的是, `foo...of` 会忽略 `return 6` 这个值, 因为 `return` 优先把 `done` 设置为 `true` 了.

另外, 因为 `foo...of` 隐藏了调用 next() 的细节, 所以`foo...of`并不适用于我们需要传值给生成器的场景.

#### 完整的例子

这个例子将同时包含数据发送给生成器函数和从生成器函数发送数据.

```javascript
function *foo(x) {
    const y = 2 * (yield (x + 1));
    const z = yield (y / 3);
    return (x + y + z);
}

const it = foo(5);
console.log(it.next()); // {value: 6, done: false}
console.log(it.next(12)); // {value: 8, done: false}
console.log(it.next(13)); // {value: 5 + 24 + 13, done: true}
```

### 总结

以上就是生成器函数的基础知识, 后续将讨论一些进阶问题:

- 错误处理如何工作?
- 一个生成器能否调用另一个生成器?
- 异步代码如何与生成器一起使用?

## 2-2. ES6 Generators 进阶

### 错误处理

对于 ES6 Generators 而言, 即使外部迭代控制是异步进行的, 生成器内部代码仍然是**同步的**. 所以仍然能使用`try...catch`机制处理错误.

```javascript
function *foo() {
    try {
        const x = yield 3;
    } catch (err) {
        console.log('Error: ' + err);
    }
}
```

当函数执行到 `yield 3` 表达式后将暂停, 如果之后将错误发送回生成器函数, 那 try...catch 将捕获到这个错误.

```javascript
const it = foo();
const res = it.next(); // {value: 3, done: false}
// 之前是使用 it.next() 让 foo 继续执行
// 但这次使用 it.throw() 将错误抛给 foo
it.throw('Oops!'); // Error: Oops! 这里是 foo 中 catch 执行的结果
```

在这里我们使用迭代器的另一个方法 `throw()` 将错误抛给生成器, 然后 `yield` 处就会发生错误, 并被 `try...catch` 捕获到.

**注意**: 如果使用 `throw()` 将错误抛给生成器, 但是生成器函数内部没有用 `try...catch` 捕获错误, 则该错误会像正常情况一样立即传播出去:

```javascript
function *foo() {}
const it = foo();
try {
    it.throw('Oops!');
} catch (err) {
    console.log('Error: ' + err); // 因为 foo 内部没有使用 try...catch 捕获错误, 所以错误传播了出来, 并在这里被捕获到.
}
```

另外, 错误处理的方向也可以是相反的(之前是外部抛错误给生成器函数内部, 显然生成器函数内部也可以直接触发错误传播给外部)

```javascript
function *foo() {
    const x = yield 3;
    const y = x.toUpperCase(); // 可能会报类型错误
    yield y;
}
const it = foo();
it.next(); // {value: 3, done: false}
try {
    it.next(42); // 42是数字无法调用toUpperCase()
} catch (err) {
    console.log(err); // TypeError 来自于 42.toUpperCase()
}
```

### 委托 Generators

在某些时候, 我们可能会需要在生成器函数中调用另一个生成器函数, 此时除了在当前生成器函数中创建迭代器以外, 也可以将要调用的生成器函数委托给外部的迭代器. 如果要这样做, 就要使用 `yield` 关键字的变体: `yield *`.

```javascript
function* foo() {
  let x = yield 3;
  x = yield 4;
}

function* bar() {
  yield 1;
  yield 2;
  yield* foo();
  yield 5;
}

for (const v of bar()) {
  console.log(v);
}
// 1 2 3 4 5
```

此时, 一开始迭代器是被用来控制 bar() 的, 但当执行到 yield* foo() 时, 迭代器被委托用来控制 foo(), 可以这样理解:

```javascript
const it = bar();
console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}
console.log(it.next()); // {value: 3, done: false}
console.log(it.next("x value")); // {value: 4, done: false} 此时 foo 中 x 变量的值为 "x value"
```

另外一个 `yield *` 的技巧是从 `return` 中获取代理的生成器的结束返回值.

```javascript
function* foo() {
    yield 2;
    yield 3;
    return "foo";
}

function* bar() {
    yield 1;
    const v = yield* foo(); // 可以获取 foo return 的值, yield 的返回值是拿不到的
    console.log("v: " + v);
    yield 4;
}

for (const v of bar()) {
    console.log(v);
}
// 1 2 3
// v: foo
// 4
```

如例子所示, `yield* foo()` 会委托迭代控制(`next()` 调用), 一旦 `foo()` 全部执行完成了, 就会获取到 `foo` 中 `return` 的值(在这里是字符串 `"foo"`), 并将值分配给变量 `v`.

这也是 `yield` 和 `yield *` 的区别, 对于 `yield` 表达式, 得到的结果是 `next()` 传递的内容. 但是对于 `yield *` 表达式, 它仅能接收到委托的生成器中的 `return` 的内容. (因为 `next()` 发送的值被委托出去了)

另外也可以在 yield * 委托时处理错误

```javascript
function* foo() {
    try {
        yield 2;
    } catch (error) {
        console.log("foo caught: " + error);
    }
    yield 3;
    throw "Oops!";
}

function* bar() {
    yield 1;
    try {
        yield* foo();
    } catch (error) {
        console.log("bar caught: " + error);
    }
}

const it = bar();

console.log(it.next()); // {value: 1, done: false}
console.log(it.next()); // {value: 2, done: false}

console.log(it.throw("Uh oh!")); // foo caught: Uh oh!
// {value: 3, done: false}

console.log(it.next()); // bar caught: Oops!
// {value: undefined, done: true}
```

### 总结

因为生成器函数内部也是同步执行的, 这意味着可以像往常一样使用 `try...catch` 处理 `yield` 中的错误. 迭代器还有一个 `throw()` 方法可以在生成器暂停的位置向生成器抛错误, 这个错误也可以被生成器内部的 `try...catch` 捕获到.

`yield *` 允许将迭代控制从当前生成器委托给另一个生成器.

目前为止, 讨论的都是生成器函数的同步执行, 接下要讨论的就是生成器如何与异步代码一起使用.

## 2-3. ES6 Generators 处理异步

生成器的主要优点在于, 它提供了单线程的, 具有同步代码样式的外观, 同时又允许你将异步的实现细节隐藏起来. 这个优点将让我们可以非常自然的表达程序的步骤与流程, 而不用关心异步语法的陷阱和问题(如回调地狱).

换句话说, 通过将生成器的逻辑与迭代器的实现细节分开, 我们实现了功能/关注点的分离.

这样做的结果就是, 所有异步代码的功能, 都有了同步代码的外观, 提高了可读性和可维护性.

### 最简单的异步

先来一个最简单的使用生成器函数处理异步的例子.

```javascript
function makeAjaxCall(url, cb) {
  setTimeout(() => {
    cb(
      JSON.stringify({
        url,
        code: 200,
        t: Date.now(),
      })
    );
  }, 100);
}

makeAjaxCall("http://url1", function (result1) {
  const data = JSON.parse(result1);
  makeAjaxCall("http://url2/?id=" + data.t, function (result2) {
    const resp = JSON.parse(result2);
    console.log(resp);
  });
});
```

上面体现了异步代码常见的问题, 回调地狱. 现在来看一下使用生成器函数来处理类似的需求.

```javascript
let it;
function request(url) {
  makeAjaxCall(url, function (response) {
    it.next(response);
  });
}
function* main() {
  const result1 = yield request("http://url1");
  const data = JSON.parse(result1);
  const result2 = yield request("http://url2/?id=" + data.t);
  const resp = JSON.parse(result2);
  console.log(resp);
}

it = main();
it.next();
```

要注意的是 `request()` 包装了 `makeAjaxCall`, 并确保在回调时调用迭代器的 `next()` 方法.

要注意的是这里的 `request()` 调用并没有返回值. 就是说这里的 `yield` 其实发送的是 `undefined`, 后续我们会改进, 不过在这里这并不重要, 因为我们调用 `yield` 主要是为了暂停生成器, 并且在 `makeAjaxCall` 回调调用了 `it.next()` 后才恢复. 

此时因为 `it.next(response)` 已经把返回值(response)发送回生成器了, 所以 `result1/result2` 就能拿到异步请求的数据了.

此时在 `main` 中的 `result1 = yield request()` 看起来就像是请求数据并隐藏了实现细节. 阅读代码时看起来就像是一连串同步的方法, 这样看代码阅读起来会非常清晰, 唯一的代价就是 `yield`, 而与 `yield` 这个非常小的语法开销相比, 嵌套回调地狱将可怕的多!

另外因为 request 已经隐藏了实现细节, 所以要为 request 增加功能是很简单的事, 比如说增加一个缓存功能:

```javascript
const cache = {};
function request(url) {
    if(cache[url]) {
        setTimeout(function() {
            it.next(cache[url])
        }, 0);
    } else {
        makeAjaxCall(url, function(resp) {
            cache[url] = resp;
            it.next(resp);
        });
    }
}
```

>  注意: 这里使用了 setTimeout(...,0), 是因为这里如果直接调用, 会报 `Generator is already running`错误, 因为此时生成器函数还没有处于暂停状态, 所以暂时先用 setTimeout(...,0) hack 将立即执行改为稍后调用. 后面将提供更好的方案.

这个例子主要是将异步调用抽象后, 细节分离开将带来更清楚的代码可读性与维护性.

### 更好的异步

上个例子实现了一个简单的异步生成器, 但功能有限. 因此我们需要一个更强大的异步机制来与生成器配合, 从而能够处理更复杂的工作, 这个异步机制就是 Promise.

上个例子有以下几个问题:

1. 没有明确的错误处理方法. 当然我们也可以手动检测 makeAjaxCall 是否发生错误, 并将该错误以 it.throw() 的形式抛出. 然后在生成器函数中使用 try...catch 来处理它, 但如果我们的程序中大量使用生成器, 就可能需要手动实现这些重复的代码.
2. 如果 makeAjaxCall 是一个第三方类库且并不在我们的控制之下, 然后又碰巧多次调用了回调, 或者回调即可能是发送成功通知也可能是发送错误通知等. 这时生成器为了处理和预防这些问题可能需要大量的手动工作(**第1点和第2点其实最终都需要大量代码写在生成器函数中, 但这样一来就和生成器函数的优点: 隐藏细节背道而驰了**), 而且可能也无法移植.
3. 很多时候, 我们需要"并行"执行多个任务(如, 同时执行两个 AJAX 请求). 由于生成器 yield 是单个暂停的, 所以并不能实现两个或多个同时运行的需求, 因为它们必须一次运行一个.

以上这些问题其实都是可以解决的, 但为了防止每次重新发明解决方案. 我们需要一个更强大的模式, 该模式应该是可信赖, 可重用的解决方案并且是专门为生成器异步编码而设计的.

首先将 request 改造成 promise 版本.

```javascript
function request(url) {
  return new Promise((resolve, reject) => {
    makeAjaxCall(url, resolve);
  });
}
```

将下来需要有一段程序用来控制生成器的迭代器.

```javascript
function runGenerator(g) {
  let it = g(), ret;
  (function iterate(val) {
    ret = it.next(val);
    if (!ret.done) {
      if ("then" in ret.value) {
        ret.value.then(iterate);
      } else {
        setTimeout(() => iterate(ret.value), 0);
      }
    }
  })();
}
```

在 runGenerator 中需要注意的是:

1. 自动初始化生成器的迭代器 (`it`), 然后异步运行 `it` , 直到 `done: true`.
2. 根据 promise 的规则, 等待其 `then()` 调用时继续迭代器的运行.
3. 如果返回的不是 promise, 则直接将该发送给生成器.

现在使用新的方案:

```javascript
runGenerator(function* () {
  const result1 = yield request("url1");
  const data = JSON.parse(result1);
  const result2 = yield request("url2" + data.t);
  const resp = JSON.parse(result2);
  console.log(resp);
});
```

代码看起来和之前的生成器代码非常类似. 这主要还是归功于生成器本身将细节都隐藏了起来. 接下来我们将更方便的处理之前提到的问题.

#### 错误处理

```javascript
function request(url) {
    return new Promise((resolve, reject) => {
        makeAjaxCall(url, function(err, text) {
            if(err) reject(err);
            else resolve(text);
        })
    });
}

runGenerator(function* () {
  let result1;
  try {
      result1 = yield request("url1");
  }
  catch(err) {
      console.log('Error:' + err);
      return;
  }
  const data = JSON.parse(result1);
  let result2;
  try {
      result2 = yield request("url2" + data.t);
  }
  catch(err) {
      console.log('Error: ' + err);
      return;
  }
  const resp = JSON.parse(result2);
  console.log(resp);
});
```

#### 并发操作

```javascript
const search_terms = yield Promise.all([
    request("url1"),
    request("url2"),
    request("url3"),
]);
```

使用 Promise.all([...]) 即可实现并发操作.

### ES7 async

其实上述的使用 Generators + Promise 的方案, 在 ES7 中有一个很类似的功能可以代替, 就是 `async / await`. 使用它的话代码类似这样:

```javascript
async function main() {
    const result1 = await request('url1');
    const data = JSON.parse(result1);
    
    const result2 = await request('url2?id=' + data.id);
    const resp = JSON.parse(result2);
    console.log(resp);
}
main();
```

### 总结

简而言之, 使用 `generators` + `yield` Promise, 结合两者的优势, 可以获得一个真正强大和优雅的并且看起来像是同步的异步流程控制.

在 ES7 则可以直接使用 `async function` 实现.