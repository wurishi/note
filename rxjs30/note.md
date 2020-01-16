[参考资料](https://www.yuque.com/octavio000416/nb6ycv)

> RxJS 版本: 6.5.4

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

[代码 03-map](codes/03-map.js)

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

[代码 06-fromevent](codes/06-fromevent.html)

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

# 07: Observable Operators & 弹珠图 (Marble Diagrams)

## 1. 什么是Operator ?

~~Operators 就是一个个被附加到 Observable 上的函数, 例如像是 map, filter, contactAll... 等等. 所有这些函数都会拿到原来的 observable 并返回一个新的 observable.~~

RxJS 6 开始使用管线操作(pipe), operators 将不再是 observable 上的函数, 而是统一调用 observable 上的 pipe, 然后传递不同的 operator 来实现. 所以这里再称呼为 observable operators 可能会有不妥.

[代码 07-operator-map](codes/07-operator-map.js)

> 这里的 map 函数接收二个参数. 第一个是原来的 observable, 第二个是 map 的 callback function.
>
> 重点是这里的 map 这个 operator 会返回一个新的 observable.

> 在 RxJS[^注7-1] 的实现中, 其实每个 operator 是通过原来的 observable 的 lift 方法来创建新的 observable的, 这个方法会在返回的新 observable 对象中偷偷添加二个属性, 分别是 source 和 operator, 用来记录原来的对象和当前使用的 operator.
>
> 其实 lift 方法还是用 new Observable(跟 create 一样). 至于为什么要独立出这个方法, 除了更好的封装以外, 主要的原来是为了让使用者能更好的 debug.

[^注7-1]: 原文这里指的是 RxJS 5 的版本.

## 2. 弹珠图 (Marble diagrams)

在介绍事物时, 文字其实是最糟的手段, 虽然文字是平时沟通的基础, 但常常千言万语也比不过一张清楚的图片. 如果我们能确定一套 observable 的图示, 就能让我们更方便的沟通与理解 observable 的各种操作了!

我们把描绘 observable 的图示称为弹珠图 (Marble diagrams), 在网上 RxJS 有非常多的弹珠图, 规则大致上都是相同的. 这里采用类似 ASCII 的方法.

我们用 `-` 来表达一小段时间, 这些 `-` 串起来就代表一个 observable.

```
----------
```

`X` (大写x) 则代表有错误发生

```
---------X
```

`|` 则代表 observable 结束

```
---------|
```

在这个时间序列中, 我们可能会发送值 (value), 如果值是数字则直接用阿拉伯数字取代, 其他类型则用相近的英文符号代表, 这里我们用 `interval` 举例:

```javascript
const source = Rx.interval(1000);
// source 的图示就会像这样:
// -----0-----1-----2-----3--...
```

当 observable 是同步发送值的时候:

```javascript
const source = Rx.of(1,2,3,4);
// source 的图标就会像这样:
// (1234)|
```

小括号代表着同步发生.

另外弹珠图也能够表达操作的前后转换, 例如:

```javascript
const source = Rx.interval(1000);
const newest = source.map(x => x + 1);
// 这时的弹珠图就会像这样:
// source: -----0-----1-----2-----3--...
//			map(x => x + 1)
// newest: -----1-----2-----3-----4--...
```

最上面的是原来的 observable, 中间是 operator, 下面则是新的observable.

[Marble Diagrams 相关资源](https://rxmarbles.com/)

## 3. Operators (一)

### 3-1: map

Observable 的 map 方法使用上跟数组的 map 是一样的.

```javascript
const source = Rx.interval(1000);
// const newest = source.map(x => x + 2); // 这是老版本的写法
// Rx6 开始使用 pipe 管道操作
const newest = source.pipe(map(x => x + 2)); // map 通过 rxjs/operators 获取
```

用弹珠图表示就是:

```
source: -----0-----1-----2-----3--...
		map(x => x + 2)
newest: -----2-----3-----4-----5--...
```

### 3-2: mapTo

mapTo 可以把传递进来的值改成一个固定的值.

```javascript
const source = Rx.interval(1000);
// const newest = source.mapTo(2);
const newest = source.pipe(mapTo(2));
```

用弹珠图表示就是:

```
source: -----0-----1-----2-----3--...
		mapTo(2)
newest: -----2-----2-----2-----2--...
```

### 3-3: filter

filter 在使用上也和数组相同.

```javascript
const source = Rx.interval(1000);
// const newest = source.filter(x => x % 2 === 0);
const newest = source.pipe(filter(x => x % 2 === 0));
```

用弹珠图表示就是:

```
source: -----0-----1-----2-----3-----4--...
		filter(x => x % 2 === 0)
newest: -----0-----------2-----------4--...
```

> map, filter 这些方法其实和数组上的同名方法是相同的操作, 因为这些都是面向函数编程中的通用函数, 就算换个语言也有机会看到相同的命名与相同的用法.
>
> Observable 实际上跟 Array 的 operators(map, filter), 在行为上还是有极大差异的. 当数据量很大时, Observable 的性能会好上非常多.

# 08: 简易拖放操作

## 1. Operators

### 1-1: take

take 是一个很简单的操作, 顾名思意就是取前几个元素后就结束, 如:

[代码 08-take](codes/08-take.js)

这里可以看到, 原来的 source 是会发射出无限元素的, 但这里使用了 take(3) 之后, 就只会取前3个元素了, 取完后就直接结束 (complete).

用弹珠图表示就是:

```
source : -----0-----1-----2-----3--...
		take(3)
example: -----0-----1-----2|
```

### 1-2: first

first 会取到 observable 送出的第1个元素之后就直接结束. 行为跟 take(1) 一致.

[代码 08-first](codes/08-first.js)

用弹珠图表示就是: 

```
source : -----0-----1-----2-----3--...
		first()
example: -----0|
```

### 1-3: takeUntil

takeUntil 经常会被用到, 它可以在某件事件发生时, 让一个 observable 直接发送完成 (complete) 信息, 如下:

[代码 08-takeuntil](codes/08-takeuntil.html)

用弹珠图表示就是:

```
source : -----0-----1-----2-----3--...
click  : --------------------c-----...
		takeUntil(click)
example: -----0-----1-----2--|
```

当 click 一触发, observable 就会直接完成 (complete)

### 1-4: concatAll

有时候一个 observable 发送的元素又是一个 observable, 就像二维数组一样, 数组里面的元素还是数组. 这个时候我们就可以使用 concatAll 把它摊平成一个一维数组. 可以把 concatAll 想像成把所有元素 concat 起来.

[代码 08-concatall](codes/08-concatall.html)

用弹珠图表示就是:

```
click  : ----------c----------c-------...
source : ----------o----------o-------...
				  \			\
				   (123)|	  (123)|
				   	 concatAll()
example: ----------(123)------(123)---...
```

这里要注意的是 concatAll 会处理 source 先发出来的 observable, 必须等这个 observable 结束, 才会再处理下一个 source 发送出来的 observable, 如下:

[代码 08-concatall-order](codes/08-concatall-order.js)

这里的 source 会发送3个 observable, 但是 coancatAll 的行为永远都是先处理第一个 observable, 等到当前处理结束之后, 才会再处理下一个.

用弹珠图表示就是:

```
source : (o1                 o2       o3)|
		  \                  \        \
		   --0--1--2--3--4|   -0-1|    ----0|
		   		concatAll()
example: --0--1--2--3--4-0-1----0|
```

## 2. 拖放操作

[代码 08-drag](codes/08-drag.html)

# 09: Observable Operators (二)

## 1. skip

take 可以取前几个发送的元素, skip 则是可以用来跳过前几个发送出来的元素.

```javascript
const source = Rx.interval(1000);
const example = source.pipe(skip(3));
example.subscribe(console.log);
// 3 -> 4 -> 5 -> ...
```

原来是从0开始的, 现在就变成从3开始了, 但要记住原来的元素等待时间仍然是存在的, 也就是说这个例子中, 取到第一个元素(3)需要等4秒.用弹珠图表示就是:

```
source : ----0----1----2----3----4----5--...
			skip(3)
example: -------------------3----4----5--...
```

## 2. takeLast

除了可以用 take 取前几个之外, 也可以倒过来取最后几个.

```javascript
const source = Rx.interval(1000).pipe(take(6));
const example = source.pipe(takeLast(2));
example.subscribe({
    next:console.log,
    complete() {
        console.log('complete');
    }
});
// 4 -> 5 -> complete
```

这里我们先取前6个元素, 再取最后2个. 所以最后会送出 4, 5, complete. 这里有一个**重点**就是, takeLast 必须是等待到整个 observable 完成 (complete), 才能知道最后的元素有哪些, 并且**同步送出**. 用弹珠图表示就是:

```
source : ----0----1----2----3----4----5|
			takeLast(2)
example: ------------------------------(45)|
```

## 3. last

跟 take(1) 相同, 有一个 takeLast(1) 的简化写法, last() 就是用来取最后一个元素的.

```javascript
const source = Rx.interval(1000).pipe(take(6));
const example = source.pipe(last());
example.subscribe({
    next:console.log,
    complete() {
        console.log('complete');
    }
});
```

用弹珠图表示就是:

```
source : ----0----1----2----3----4----5|
			last()
example: ------------------------------(5)|
```

## 4. concat

concat 可以把多个 observable 对象合并成一个.

[代码 09-concat](codes/09-concat.js)

和 concatAll 一样, concat 必须先等前一个 observable 完成 (complete), 才会继续下一个. 用弹珠图表示就是:

```
source : ----0----1----2|
source2: (3)|
source3: (456)|
			concat()
example: ----0----1----2(3456)|
```

## 5. startWith

startWith 可以在 observable 的一开始塞进要发送的元素.

```javascript
const source = Rx.interval(1000);
const example = source.pipe(startWith(0));
example.subscribe(console.log);
```

这里我们往 source 的一开始就塞了一个0, 让 example 从一开始就会立即发送0, 用弹珠图表示就是:

```
source    : ----0----1----2----3--...
			startWith(0)
example: (0)----0----1----2----3--...
```

> startWith 的值是一开始就同步发送出来的, 这个操作经常被用来保存程序的初始状态.

## 6. merge

merge 跟 concat 一样都是用来合并 observable的, 但二者在行为上有非常大的不同!

```javascript
const source = Rx.interval(500).take(3);
const source2 = Rx.interval(300).take(6);
const example = source.pipe(merge(source2));
example.subscribe({
    next:console.log,
    complete() {
        console.log('complete');
    }
});
// 0->0->1->2->1->3->2->4->5->complete
```

merge 会把多个 observable 同时处理, 这和 concat 一次处理一个 observable 是完全不一样的. 由于是同时处理, 行为会变得较为复杂, 这里使用弹珠图表示会比较好解释.

```
source : ----0----1----2|
source2: --0--1--2--3--4--5|
			merge()
example: --0-01--21-3--(24)--5|
```

# 10: Observable Operators (三)

## 1.  combineLatest

[代码 10-combinelatest](codes/10-combinelatest.js)

第一次看到输出的内容会很困惑, 直接来看弹珠图:

```
source : ----0----1----2|
newest : --0--1--2--3--4--5|
			combineLatest(newest, (x, y) => x + y)
example: ----01--23-4--(56)--7|
```

首先 combineLatest 可以接收多个 observable, 最后一个参数是一个回调函数, 这个回调函数接收的参数数量与要合并的 observable 的数量是相同的. 在例子中, 我们合并了二个 observable, 所以回调函数就会接收到 x, y 二个参数. x 会接收到 source 发送出来的值, y 会接收到 newest 发送出来的值. 最后一个**重点**是, 只有当二个 observable 都**曾经发送过值**后, 才会调用回调函数. 所以这段代码是这样运行的:

| 时序 | source | newest |                           回调函数                           |
| :--: | :----: | :----: | :----------------------------------------------------------: |
|  1   |        |   0    |      因为 source 没有发送过任何值, 所以不会执行回调函数      |
|  2   |   0    |        |       此时 newest 最后一次发送的值是 0, 所以 0 + 0 = 0       |
|  3   |        |   1    |                          0 + 1 = 1                           |
|  4   |        |   2    |                          0 + 2 = 2                           |
|  5   |   1    |        |                          1 + 2 = 3                           |
|  6   |        |   3    |                          1 + 3 = 4                           |
| 7.1  |   2    |        | 2 + 3 = 5. 此时 source 结束了, 但 newest 还没结束, 所以 example 还不会结束. |
| 7.2  |        |   4    |                          2 + 4 = 6                           |
|  8   |        |   5    | 2 + 5 = 7. 此时 newest 结束了, 因为 source 也已经结束了, 所以 example 结束 |

> combineLatest 常用在计算多个因子的结果上, 例如最常见的计算 BMI, 当身高发生变化时就会拿上次的体重计算新的 BMI, 同样的当体重发生变化时则会拿上次的身高计算 BMI.

## 2. zip

zip 会取每个 observable 相同顺序位置上的元素传入回调函数, 也就是说每个 observable 的第 n 个元素会一起传入回调函数.

[代码 10-zip](codes/10-zip.js)

用弹珠图表示就是:

```
source : ----0----1----2|
newest : --0--1--2--3--4--5|
			zip(newest, (x, y) => x + y)
example: ----0----2----4|
```

在这个例子中, zip 会等到 source 和 newest 都发送出第一个元素后, 再传入回调函数. 下次回调函数的执行将等到 source 和 newest 都送出了第二个元素后. 所以执行的步骤如下:

| 时序 | source | newest |                           回调函数                           |
| :--: | :----: | :----: | :----------------------------------------------------------: |
|  1   |        |   0    |   这时 source 并没有发送出第一个值, 所以回调函数不会执行.    |
|  2   |   0    |        |        newest 之前发送的第一个值是 0, 所以 0 + 0 = 0         |
|  3   |        |   1    |   这时 source 并没有发送出第二个值, 所以回调函数不会执行.    |
|  4   |        |   2    |   这时 source 并没有发送出第三个值, 所以回调函数不会执行.    |
|  5   |   1    |        |        newest 之前发送的第二个值是 1, 所以 1 + 1 = 2         |
|  6   |        |   3    |   这时 source 并没有发送出第四个值, 所以回调函数不会执行.    |
|  7   |   2    |        | newest 之前发送的第三个值是 2, 所以 2 + 2 = 4. 此时 source 结束, 所以 example 也就直接结束. |

可以利用 zip 来实现原来只能同步发送的数据变成异步的形式, 这种用法很适合做一些示例或者单元测试模拟数据时使用.

[代码 10-zip-hello](codes/10-zip-hello.js)

用弹珠图表示就是:

```
source : (hello)|
source2: -0-1-2-3-4-...
		zip(source2, (x, y) => x)
example: -h-e-l-l-o|
```

> 除非真的有需要, 建议不要乱用 zip. 因为 zip 必须将所有未处理的元素缓存起来. 当我们有二个 observable , 其中一个很快一个很慢时, 就会缓存非常多的元素, 用来等待比较慢的那个 observable. 这很有可能造成内存相关的问题!

## 3. withLatestFrom

withLatestFrom 运行方式和 combineLatest 有点像, 只是它有主从的关系. 只有在主要的 observable 发送出新的值时, 才会执行回调函数.

[代码 10-withlatestfrom](codes/10-withlatestfrom.js)

用弹珠图表示就是:

```
main   : ----h----e----l----l----o|
some   : --0--1--0--0--0--1|
	withLatestFrom(some, (x, y) => y === 1 ? x.toUpperCase() : x)
example: ----h----e----l----L----O|
```

> withLatestFrom 会在 main 发送出值的时候执行回调函数, 但这里有一点要特点注意, 就是如果 main 发送出值时 some 之前并没有发送过任何值, 则回调函数也是不会执行的!

以上示例代码的执行步骤如下:

| 时序 | main | some |                           回调函数                           |
| :--: | :--: | :--: | :----------------------------------------------------------: |
|  1   |      |  0   |                  只在 main 发送值时才会执行                  |
|  2   |  h   |      | 此时 some 上一次发送的值为 0 , 则回调函数('h', 0) 的执行结果为 h |
|  3   |      |  1   |                                                              |
|  4   |      |  0   |                                                              |
|  5   |  e   |      | 此时 some 上一次发送的值为 0 , 则回调函数('e', 0) 的执行结果为 e |
|  6   |      |  0   |                                                              |
| 7.1  |  l   |      | 此时 some 上一次发送的值为 0 , 则回调函数('l', 0) 的执行结果为 l |
| 7.2  |      |  0   |                                                              |
|  8   |      |  1   |                                                              |
|  9   |  l   |      | 此时 some 上一次发送的值为 1 , 则回调函数('l', 1) 的执行结果为 L |
|  10  |  o   |      | 此时 some 上一次发送的值为 1 , 则回调函数('o', 1) 的执行结果为 O |

# 11: 完整的拖放示例

仿优酷的一个拖放效果:

```
在观看优酷的影片时, 可以往下滚动页面. 此时影片就会变成一个小窗口在右下角, 这个窗口可以拖动位置.
这个功能可以让用户一边观看留言的同时又能继续观看影片.
```

[代码 11-page](codes/11-page.html)

# 12: Observable Operators (四)

## 1. scan

scan 其实就是 observable 版本的 reduce, 只是命名不同. 原生 JS 的数组就有 reduce 方法:

```javascript
const arr = [1, 2, 3, 4];
const result = arr.reduce((origin, next) => {
  console.log(origin);
  return origin + next;
}, 0);
console.log(result); // 10
```

[代码 12-scan](codes/12-scan.js)

用弹珠图表示就是:

```
source : ----h----e----l----l----o|
		scan((origin, next) => origin + next, '')
example: ----h----(he)----(hel)----(hell)----(hello)|
```

> scan 跟 reduce 最大的区别就是 scan 一定会返回一个 observable, 而 reduce 最后返回的值有可能是任何类型, 必须要看使用者传入的回调函数才能决定 reduce 最后的返回值.
>
> Jafar Husain 就曾说: JavaScript 的 reduce 是错误的, 它最后应该永远返回一个数组才对!

简单的加减示例:

[代码 12-scan-example](codes/12-scan-example.html)

## 2. buffer

buffer 总共有五个相关的操作:

- buffer
- bufferCount
- bufferTime
- bufferToggle
- bufferWhen

比较常用的是 buffer, bufferCount 和 bufferTime 这三个.

### 2-1: buffer

[代码 12-buffer](codes/12-buffer.js)

用弹珠图表示就是:

```
source : --0--1--2--3--4--5--6--7-...
source2: ---------0---------1-------...
			buffer(source2)
example: ---------([0,1,2])---------([3,4,5])--...
```

buffer 会把原本的 source 发送出的元素缓存到数组中, 等到传入的 source2 发送元素时, 就会触发将缓存的元素发送出去.

### 2-2: bufferTime

上一个示例中 source2 其实就是每一秒发送一个元素, 所以可以改用 bufferTime 更简洁的表述.

[代码 12-buffer](codes/12-buffer.js)

### 2-3: bufferCount

除了用时间来作缓存以外, 我们更常用数量来做缓存.

[代码 12-buffercount](codes/12-buffercount.js)

在实际应用中, 我们可以用 buffer 来做某个事件的过滤. 比如像是鼠标双击操作:

[代码 12-buffer-example](codes/12-buffer-example.html)

上面的示例中, 只有在500毫秒内连点二下以上, 才能成功打印出 '双击'. 

这个功能也能用在批次处理上以降低请求 (request) 的次数.