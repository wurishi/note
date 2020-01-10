# 00: 安利RxJS

## 1. 响应式编程的兴起

响应式编程 (Reactive Programming).

Vue 底层是以响应式编程的概念来设计的.

## 2. Observable 标准化

未来ECMAScript的标准, 目前TC39 Stage1阶段.

## 3. 多语言支持

主流语言都有Rx的库, 如:RxJava, RxPy, RxRuby等.

# 01: 认识 RxJS

## 1. 异步常见问题

- 竞态条件 (Ract Condition)

  当对同一资源作多次异步操作时, 可能会发生竞态条件问题.

  如: 更新用户信息 (Request1) 的同时再请求获得用户信息 (Request2), 二个请求的先后顺序会造成最终结果的不同.

- 内存泄漏 (Memory Leak)

  在SPA (Single Page Application)中, 并不是像传统网站那样全部整页刷新的, 而是通过 Javascript 实现页面内容切换的, 这样对 DOM 注册的事件, 一旦没有在适当的时间移除, 就会造成内存泄漏.

  如: A页面监听了 body 的 scroll 事件, 但页面切换时, 并没有将 scroll 的监听事件移除.

- 复杂状态 (Complex State)

  页面操作都是异步行为时, 每次行为都会改变程序中的一个状态, 导致状态可能会非常复杂.

  如: 播放付费电影这个业务, 首先要抓取影片的信息, 然后再在播放时还要验证用户是否有权限播放. 同时, 用户也可能在按下播放后,马上又按了取消. 以上行为都可以是异步操作, 这时就会有各种复杂的状态需要处理.

- 错误处理 (Exception Handling)

  Javascript 通过 try/catch 可以捕获同步的错误, 但异步的错误就会比较麻烦[^注1-1], 特别时异步操作非常复杂时, 问题尤为明显.

[^注1-1]: async/await 捕获异步操作应该还好吧.

## 2. 各种不同的 API

常见的异步 API:

- DOM Events
- XMLHttpRequest
- Fetch
- WebSockets
- Server Send Events
- Service Worker
- Node Stream
- Timer

以上的异步 API, 每种都有各自独特的写法! 如果使用RxJS, 可以统一通过 RxJS 处理, 这样就能使用统一的 API 操作了.(RxJS 的 API)

例子: 监听点击事件

```javascript
// 原生 JavaScript
const handler = e => {
    console.log(e); // 打印
    document.body.removeEventListener('click', handler); // 执行一次后移除事件
};
document.body.addEventListener('click', handler); // 注册事件

// Rx 大概的样子
Rx.Observable
	.formEvent(document.body, 'click') // 注册事件
	.take(1) // 只执行一次(即执行一次后移除事件)
	.subscribe(console.log); // 事件发生时,执行打印操作
```

## 3. RxJS 基本介绍

RxJS 是一个由一系列 Observable 组合起来的处理异步和事件的库.

> 可以把 RxJS 当作是处理异步的Lodash.

RxJS 也被称为 Functional Reactive Programming (FRP), 但更准确的来说应该是 Functional Programming[^注1-2] 和 Reactive Programming[^注1-3] 二种编程思想的结合.

[^注1-2]: 面向函数编程
[^注1-3]: 响应式编程

## 4. 关于 Reactive Extension (Rx)

Rx 最早是微软开发的 LinQ[^注1-4] 的一种扩展. 它的目标是对异步的集合进行操作.

[^注1-4]: LinQ 念作 Link, 全称是 Language-Integrated Query; 学习 RxJS 不用会 LinQ;

## 5. 关于函数响应编程 Functional Reactive Programming

FRP 是一种编程范式(programming paradigm), 类似 OOP 其实也是一种编程范式.

OOP 让我们使用面向对象的方法来思考问题, 编写程序. FRP 则是包含了 Functional Programming 和 Reactive Programming 二种编程思想.

面向函数编程 (Functional Programming):

使用面向函数的方式思考问题, 编写代码.

Reactive Programming:

当变量或资源发生改变时, 由变量或资源主动通知我发生了改变.

如: Vue.js 的双向绑定, 就是通过 ES5 的 definedProperty 的 getter/setter 实现当变量发生改变时, 就执行 getter/setter, 从而外界依赖这个变量的地方都能知道变量发生了改变. 这也被称作为依赖收集.

# 02: 面向函数编程基本概念

## 1. 什么是面向函数编程

面向函数编程 (Functional Programming) 就是让我们使用 function 来思考和解决问题.

比如下面这个运算的例子: 

```
(5 + 6) - 1 * 3
```

可以写成这样:

```javascript
const add = (a, b) => a + b;
const mul = (a, b) => a * b;
const sub = (a, b) => a - b;
sub(add(5, 6), mul(1, 3));
```

我们把每个运算单独写成一个个不同的 function , 并使用这些 function 组合出我们想要的结果. 这就是最简单的面向函数编程.

## 2. 面向函数编程的基本条件

就像不是所有语言都支持 OOP 一样, 也不是所有语言都支持 FP 的. 要能够支持 FP 的语言至少需要满足一个条件.

> 函数必须是一等公民.

- 函数要能够赋值给变量

  ```javascript
  const hello = function () {};
  ```

- 函数能够作为参数传递

  ```javascript
  fetch('www.google.com')
      .then(function(response) {});
  ```

- 函数能够被当作返回值

  ```javascript
  function (a) {
      return function (b) {
          return a + b;
      };
  }
  ```

## 3. 面向函数编程的特点

### 3-1: 表达式而不是语句 (Expression, no Statement)

FP 都是表达式 (Expression) 而不是语句 (Statement).

表达式是一种运算过程, 一定会有返回值. 比如执行一个 function:

```javascript
add(1, 2)
```

语句则表现为某种行为. 比如给一个变量赋值:

```javascript
a = 1
```

> 有时候表达式也可能同时是合法的语句, 深入了解二者的区别可以参考 [Expressions versus statements in JavaScript](https://2ality.com/2012/09/expressions-vs-statements.html)

### 3-2: 纯函数

纯函数 (Pure Function) 指只要给一个 function 相同的参数, 得到的返回值应该也是完全相同的. 并且不会有其他显著的副作用 (Side Effect).

```javascript
const arr = [1, 2, 3, 4, 5];
arr.slice(0, 3); // [1, 2, 3]
arr.slice(0, 3); // [1, 2, 3]
arr.slice(0, 3); // [1, 2, 3]
// 这里的 slice 不管执行几次, 返回值都是相同的, 并且除了返回一个值以外, 没有做任何其他事情. 所以这个 slice 就是一个纯函数.
```

```javascript
const arr = [1, 2, 3, 4, 5];
arr.splice(0, 3); // [1, 2, 3]
arr.splice(0, 3); // [4, 5]
// 换成使用 splice , 因为 splice 每执行一次都会影响 arr 的值, 导致每次返回的结果都不同. 所以 splice 明显就不是一个纯函数, 它有一个明显的副作用, arr 被改变了.
```

#### 3-2-1: 无副作用

副作用 (Side Effect) 是指一个 function 做了跟本身运算返回值无关的事情. 比如修改了全局变量, 或者修改了传入的参数等. 甚至是执行 console.log 都能算是副作用.

在 FP 里强调没有副作用, 也就是说 function 要保持纯粹, 只做运算并返回值, 没有其他额外的行为.

前端常用的副作用举例:

- 发送 http request
- 打印值或者写日志
- 获得用户的 input
- Query DOM

#### 3-2-2:  引用透明

引用透明 (Referential transparency), 即要求纯函数不管外部环境如何, 只要参数相同, 函数的返回结果必定也相同. 这种不依赖任何外部状态, 只依赖传入参数的特性也被称为引用透明. 

### 3-3: 利用参数保存状态

Redux 的状态是由各个 reducer 组成的, 每个 reducer 的状态是保存在参数中的[^注2-1].

```javascript
function countReducer(state = 0, action) {
    // return newState
}
```

递归[^注2-2], 通过递归调用 findIndex 查找元素位置. 由参数 start 来保存当前找到第几个 index 的状态.

```javascript
function findIndex(arr, predicate, start = 0) {
    if(0 <= start && start < arr.length) {
        if(predicate(arr[start])) {
            return start;
        }
        return findIndex(arr, predicate, start+1);
    }
}
findIndex(['a', 'b'], x => x === 'b');
```

[^注2-1]: 应该是初始化状态吧.
[^注2-2]: 递归会制造多层 stack frame, 导致运算速度降低. ES6 提供了 tail call optimization, 让我们有办法优化递归调用.

## 4. 面向函数编程的优点

### 4-1: 可读性

```javascript
[9, 4].concat([8, 7]) // 拼接数组
	.sort() // 排序
	.filter(x => x > 5); // 过滤大于5的数字
```

### 4-2: 可维护性

因为纯函数的特性, 执行结果不会依赖外部状态, 也不会对外部环境有任何操作. 使得 FP 能够更方便的检查错误以及编写单元测试.

### 4-3: 更易于并行/并发处理

因为基本上只做运算不做 I/O, 再加上没有副作用的特性, 所以不容易出现死锁 (deadlock) 等问题.

> 并发, 就像1个人 (cpu) 同时喂2个孩子 (程序), 每人轮流喂1口, 表面上来看2个孩子都在吃饭.
>
> 并行, 就是2个人喂2个孩子, 2个孩子也是同时在吃饭.

# 03: 面向函数编程中的枚举函数

RxJS 中核心的 Observable 的操作概念和 FP 中的数组枚举操作很相近。

forEach: 是 JavaScript 从 ES5 开始提供的一种遍历(枚举)数组的方法. 接下来通过 forEach 来实现 map, filter, concatAll 方法[^注3-1].

[^注3-1]: 虽然 ES5 已经提供了原生的 map/filter 等方法. 但再次实现一遍有助于理解.

## 1. map

[代码 03-map](./codes/03-map.js)

## 2. filter

[代码 03-filter](codes/03-filter.js)

## 3. concatAll

[代码 03-concatAll](codes/03-concatall.js)

# 04: 什么是 Observable ?

整个 RxJS 的基础就是 Observable.

要理解 Observable 之前, 要先了解二个设计模式 (Design Pattern), 迭代器模式 (Iterator Pattern) 和 观察者模式 (Observer Pattern)

## 1. 观察者模式

观察者模式经常会用到, 许多 API 的设计上都会使用观察者模式. 最简单的例子就是 DOM 的事件监听.

```javascript
document.body.addEventListener('click', function (event) {
	console.log('click');
});
```

[代码 04-observer](codes/04-observer.js)

观察者模式主要就是为了让事件和监听者去除耦合.

## 2. 迭代器模式

迭代器 (Iterator) 其实就是一个指针 (pointer), 它会指向一个集合并产生一个序列 (sequence), 这个序列里面有集合中所有的元素 (element).

[代码 04-iterator](codes/04-iterator.js)

> JavaScript 到了 ES6 才有原生的迭代器.
>
> 在 ECMAScript 中迭代器最早采用的是类似 Python 的迭代器规范, 即迭代器在没有元素之后再执行 next 方法, 会直接抛出错误. 但后来经过一段时间讨论后, 决定采用更函数(functional) 的做法, 改成在取得最后一个元素之后执行 next 方法将永远返回 { done: true, value: undefined }.

迭代器模式有二个优点:

1. 因为它是渐进式的获取内容的, 所以可以用来做延迟运算 (Lazy evaluation), 可以更好的处理大量数据.
2. 因为迭代器本身是一个序列, 所以就可以对这个序列使用所有数组的相关方法, 如: map, filter 等.

## 3. 补充: 延迟运算 

延迟运算 (Lazy evaluation), 也称为 call-by-need, 是一种运算策略 (evaluation strategy). 通俗的讲, 就是我们让表达式并不是马上去运行, 而是延迟到我们需要表达式运算出来的结果时, 才让它开始运算.

[代码 04-lazy](codes/04-lazy.js)

```javascript
function* getNumbers(words) {
  for (let word of words) {
    if (/^[0-9]+$/.test(word)) {
      yield parseInt(word, 10);
    }
  }
}

const iterator = getNumbers('30 天精通 RxJS (04)');
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 4, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

上面的getNumbers函数, 并不是一将字符串丢进去, 就获得所有字符串中的数字的. 而是必须等到执行 next() 时, 才会做运算. 这就是所谓的延迟运算.

## 4. Observable

在了解了观察者和迭代器后, 我们会发现其实观察者和迭代器有一个共同的特点, 那就是它们都是渐进式 (progressive) 的获得内容的. 区别只在于观察者它是生产者 (Producer), 负责推送内容 (push), 而迭代器是消费者 (Consumer), 它只要获取内容 (pull).

![4-4-1](assets/4-4-1.png)

Observable 其实就是上述二种设计模式的结合. 它既具备生产者推送内容的特性, 同时也能像序列一样, 拥有序列处理内容的方法(map, filter...).

更简单的来说, Observable 就是一个序列, 里面的元素会随着时间而推送.

# 05: 创建 Observable

> 一定要分清楚 Observable 和 Observer , 二者不要搞混.

整个 RxJS 说白了就是一个核心三个重点.

核心就是 Observable 再加上相关的操作 (map, filter...).

三个重点分别是

- Observer (观察者)
- Subject
- Schedulers

> redux-observable 就是使用 Subject 实现的

## 1. 创建 Observable (一)

创建 Observable 的方法有很多种, 其中 create 是最基本的方法. create 方法在 Rx.Observable 中, 要传入一个回调函数, 这个回调函数会接收一个观察者 (observer) 参数.

```javascript
const observable = Rx.Observable.create(function(observer) {});
```

> 虽然 Observable 可以被 create, 但通常在实际使用中都是使用 creation operator 像是 from, of, fromEvent, fromPromise 等.

[代码 05-create](codes/05-create.js)

> 虽然订阅 Observable (observable.subscribe()) 和 addEventListener 在行为上很像, 但二者在实现上是有非常大的不同的. 最大的区别在于, 实际上 Observable 本身并没有管理订阅的清单.

[代码 05-createasync](codes/05-createasync.js)

> Observable 可以同时处理同步与异步!

## 2. 观察者 (Observer)

Observable 可以被订阅(subscribe), 或者说可以被观察. 而订阅 Observable 的对象又被称为观察者 (Observer). 观察者有三个方法 (method), 每当 Observable 发生事件时, 便会执行观察者相对应的方法.

观察者的三个方法:

- next: 每当 Observable  发送出新的值, next 方法就会被执行.
- complete: 当 Observable 没有其他的内容可以取得时, complete 方法就会被执行. 在 complete 执行之后, next 方法将不会再起作用.
- error: 每当 Observable 内发生错误时, error 方法就会被执行.

```javascript
const observer = {
  next(value) {
    console.log(value);
  },
  error(error) {
    console.log(error);
  },
  complete() {
    console.log('complete');
  }
};
```

[代码 05-observer](codes/05-observer.js)

观察者可以是不完整的, 它可以只有一个 next 方法

```javascript
const observer = {
  next(value) {
    console.log(value);
  }
};
```

subscribe 方法也可以按 next, error, complete 的顺序依次传入.(主要是有些事件, 如 click, 它可能是一个无限序列, complete 是永远不会被执行的)

```javascript
observable.subscribe(
    value => { console.log(value); },
    error => { console.log('Error: ', error); },
    () => { console.log('complete'); }
);
// observalbe.subscribe 会在内部自动生成一个 observer
```

## 3. Observable 实现细节

Observable 的订阅跟 addEventListener 的实现有很大的差异. addEventListener 本质上是观察者模式的实现, 它的内部会有一份订阅清单, 如代码 04-observer.js 中 的Producer , 它的内部有一份所有监听者的清单 (this.listeners), 在发布通知时, 会逐一执行清单中的监听者. 但 Observable 不是这样实现的, 它的内部并没有一份订阅者清单. 订阅 Observable 的行为比较像是执行了一个对象中的方法, 并把生成的内容传到指定的方法中.

类似这样:

```javascript
function subscribe(observer) {
	observer.next('Jerry');
    observer.next('Anna');
}
subscribe({
    next(value) {
        console.log(value);
    },
    // error, complete...
});
// 这里的 subscribe 是一个 function, 这个 function 执行时会传入一个观察者(observer), 而 subscribe 执行时,内部会再去执行观察者的方法
```

> 订阅一个 Observable 就像是执行一个 function.

# 06: 创建 Observable (二)

Observable 有许多创建对象的方法, 称为 creation operator. 以下是 RxJS 中常用的 creation operator.

- create
- of
- from
- fromEvent
- ~~fromPromise~~ (新版本直接使用 from)
- never
- empty
- throw
- interval
- timer

## of

同步的传递几个值时, 可以使用 of 这个 operator.

[代码 06-of](codes/06-of.js)

## from

of 操作的参数其实就是一个 list. 而 list 在 JavaScript 中最常见的就是数组 (array), 那有没有办法将一个已经存在的数组直接作为参数使用呢?

有的, 可以使用 from 来接收任何可迭代 (iterable) 的参数!

[代码 06-from](codes/06-from.js)

> 因为 ES6 后可迭代 (iterable) 的类型变多了, 所以 fromArray 就被移除了.

[代码 06-from-str](codes/06-from-str.js)

> from 也可以接收字符串, 内部会逐一遍历每个字符.

## ~~fromPromise~~

[代码 06-frompromise](codes/06-frompromise.js)

> 新版本没有 fromPromise 了, 可以直接使用 from 处理 promise.

## fromEvent

我们也可以使用 Event 来创建 Observable, 使用 fromEvent 方法即可.

[代码 06-fromevent.html](codes/06-fromevent.html)

> fromEvent 的第一个参数是 DOM 对象, 第二个参数是要监听的事件名称.
>
> 取到 DOM 对象的常用方法有: getElementById(); querySelector(); getElementsByTagName(); getElementsByClassName(); 等

## fromEventPattern (补充)

要用 Event 来创建 Observable 对象还有另一个方法 fromEventPattern, 这个方法是给类事件使用的. 所谓的类事件, 可以理解为我们自己创建的其行为与事件相像的对象(即同时具备注册监听与移除监听这二种行为), 就像 DOM Event 有 addEventListener 及 removeEventListener 一样. 比如之前实现的 [Observer Pattern](04-observer.js)就是一个类事件.

[代码 06-fromeventpattern](codes/06-fromeventpattern.js)

> 传入的方法要注意 this 指向的问题.

## empty, never, throw

这几个操作单独看起来没有什么意义, 之后在使用 observables 的合并 (combine), 转换 (transforme) 的方法时, 这些操作将会变得很有用.

### 1: empty

在数学中的 零 (0), 虽然有时候看起来没什么用, 但却非常的重要. 在 Observable 中也有类似的东西, 就是 empty.

[代码 06-empty](codes/06-empty.js)

> empty 会给我们一个空的 observable, 订阅这个 observable, 它会直接发送 complete.
>
> 可以直接把 empty 想成没有做任何事, 但它至少还是会告知你.(complete 还是被执行了)

### 2: never

在数学上有一个跟零 (0) 很像的数字, 那就是无穷( ∞ ). 在 Observable 里我们使用 never 来建立无穷的 observable.

[代码 06-never](codes/06-never.js)

> never 会给我们一个无穷的 observable, 订阅这个 observable 会发生什么事情呢?
>
> ...什么事都不会发生, 它就是一个一直存在但却什么都不会做的 observable.
>
> 可以把 never 想像成一个结束在无穷久之后的 observable, 但我们永远等不到那一天!

### 3: throw

throw 就只做一件事, 那就是抛出错误.

[代码 06-throw](codes/06-throw.js)

> 新版本中没有 throw 了, 使用 throwError 代替.

## interval, timer

这二个操作都与时间有关. 在 JavaScript 中, 我们使用 setInterval 来建立一个持续的行为, 这也能用在 Observable 中.

[代码 06-interval](codes/06-interval.js)

[代码 06-timer](codes/06-timer.js)

## 订阅与取消订阅

有时候在某些行为后我们就不需要这些 observable了, 要做到这件事, 最简单的方法就是取消订阅 (unsubscribe).

[代码 06-unsubscribe](codes/06-unsubscribe.js)

> 返回的 subscription 对象还有其他合并订阅等功能.
>
> Events observable 尽量不要使用 unsubscribe, 通常我们会使用 takeUntil, 在某个事件发生后来完成取消操作.