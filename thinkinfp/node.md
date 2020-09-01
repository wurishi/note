# Think in FP

## 00: Functional Programming 简述

### Functional Programming 堀起

Functional Programming (FP) 从 Lisp 开始已经有近60年的历史了, 但直到近10几年才越来越受到重视, 不但新的 Functional Programming Languages (如 Clojure, Elm, Elixir) 不断的出现. 主流语言(如 JavaScript, Python, Swift) 也都具备了支持 FP 的特性, 连 Java, PHP 也都相继加入支持 FP 的语言特性.

FP 的思想不只是影响在编程语言上, 程序架构上也都受到了 FP 的影响, 例如 Google 提出的 MapReduce 用来处理大量数据的并行运行. 如今 FP 的重要性已经不言而喻, 几乎可以说是程序员的必备知识.

### 跨领域语言

如前所述, 目前所有主流语言对于 FP 都有很强的支持, 学习 FP 的概念对于学习不同领域的语言都会有很大的帮助, 尤其是理解 FP 的抽象概念后, 上手相关新语言的成本会大大降低!

### 抽象化思维

FP 的影响不止在写代码上, 更多的是一种思维上的转变.

## 01: Why Functional Programming ?

![terrible-world](assets/terrible-world.gif)

当我们接手或开发一个无比庞大又极度不稳定的系统时, 最常遇到的麻烦是, 当我们修改了 A 组件(Component)时, 我们已经确认所有使用 A 组件的地方都跟着修改了, 但修改完后仍然造成了 B, C 出错, 当我们去把 B, C 修好后, 可能 D, E 又坏了. 最后不得不重写整个系统.

### 系统难以维护的原因

什么原因导致系统会出现改 A 坏 B, 改 B 又坏 C 呢? 理论上我们修改了 A, 只要根据 A 组件输入输出是否有改动, 去查找对应使用 A 的地方做对应的修改就可以了, 但即使如此为什么还是会出现没被发现的 BUG ?

最有可能的原因就是 A 组件不是 **pure** 的, 它改动了外部的状态, 当你改变了 A 的行为, 可能同时影响到了外部状态的改变, 而 B 又可能依赖于这个外部状态, 导致 B 出错.

用 sample code 来表示的话大概是像下面这样:

```javascript
const state = { xxx: 1 };

function A (x) {
    let s;
    //...
    state.xxx = s;
    //...
    return s;
}

function B (y) {
    let z;
    //...
    z = y + state.xxx;
    //...
    return z;
}
// A 跟 B 并没有直接相关, B 也没有使用到 A, 但修改 A 时, 有可能会造成 B 出错.
```

如果用 FP 的写法, 我们会完全避免这种 Function 的产生, 这会大大降低系统的状态复杂度, 进而减少 BUG.

- Pure: 是指一个 Function 只要传入相同的参数将永远返回相同的结果, 并且不会造成任何副使用(Side Effect), 如修改外部状态.
- FP: FP 虽然不能完全避免 BUG, 但可以减少不必要的复杂度, 让系统更好维护.
- Out of the Tar Pit: 这篇[论文](http://curtclifton.net/papers/MoseleyMarks06a.pdf?fbclid=IwAR0gb8bUhNOewLehDjazJapgwIQAFaG6NEGiL_WWpLqXs1c8KaIKtJAZCiE)在探讨各种编程模式能不能降低系统的复杂度, 其中就有提到 FP 可以很好的避免因状态所导致的复杂性问题.

### Functional Programming 的优势

#### 低复杂度 (Complexity)

如前所述, FP 世界中的 Function 没有状态, 也不会直接存取或修改外部的状态, 只要同一个 Function 输入相同的参数, 就永远会返回相同的结果. 因此代码也会更好维护, 同时开发速度也会更快, 不容易出现莫句其妙的 BUG.

#### 简单 (Simple), 也更容易 (Easy)

FP 的世界里面只要学会 Function, 不用再学习各种设计模式 (pattern), 通过 Function 的组合以及好的命名, 就能让程序更可读也更具有弹性.

| OO pattern/principle (面向对象的设计模式/原则) | FP equivalent (函数式编程的对应等价内容) |
| ---------------------------------------------- | ---------------------------------------- |
| Single Responsibility Principle (单一责任原则) | Functions                                |
| Open/Closed principle (开闭原则)               | Functions                                |
| Dependency Inversion Principle (依赖倒转原则)  | Functions                                |
| Interface Segregation Principle (接口隔离原则) | Functions                                |
| Factory pattern (工厂模式)                     | Functions                                |
| Strategy pattern (策略模式)                    | Functions                                |
| Decorator pattern (装饰器模式)                 | Functions                                |
| Visitor pattern (访问者模式)                   | Functions                                |

简单 (Simplicity) 是可靠 (reliability) 的先决条件, 简单带来的好处是: 容易理解, 容易改变, 容易除错和具有弹性.

#### 代码简洁

FP 使用大量的 Function, 几乎每个 Function 都可以由非常小的 Function 组合出来, 减少代码的重复度, 因此 FP 的写法通常代码较短.

在 2002 年, [Revenge of the Nerds](http://www.paulgraham.com/icad.html) 文中提到 ITA 的总裁说同样的功能下 1 行的 Lisp 可以取代 20 行的 C.

在《人月神话》第八章有提到, 选择合适的高阶程序语言(相较于低阶语言代码行数较少), 有助于提升项目的开发速度, 生产力可以提升五倍. 不过使用 FP 能够提升开发速度的原因并不在于代码行数的减少, 更大的原因是降低了 BUG 产生的可能性, 让除错的时间更少. (在《人月神话》中预估测试与除错要花费整个项目开发时间的一半)

## 02: All You Need Is Function

### Functional Programming 是什么 ?

Functional Programming (FP) 是一种编程范式 (programming paradigm), FP 的核心思想就是通过 function 为解决各种问题, 并且所有的 function 都是以 **数学函数** 为模型. 在 FP 里 function 是有更明确定义的:

functions 是一种表达式, 可以输入参数, 一理输入参数后就可以**被简化(reduced)**或是说**被运算(evaluated)**.

```javascript
add(1)(2) // 可以被简化成 3
```

所有 Pure Functional Programming Languages 都是由表达式(expression) 所组成的, 这跟其他大多数语言不同, 大多数编程语言是由表达式(expression)和语句(statement) 组成的.

### Function

#### 一等公民 (First-Class)

在 Functional Programming 的世界里 function 是一等公民(first-class), 所谓的一等公民指的是 function 和其他数据类型是具有相同地位的, 也就是说 function 可以当作一个 function 的参数, 也可以被当作一个 function 的返回值, 也可以赋值或保存到变量中.

```javascript
function request(onSuccess) { // onSuccess 是一个 function 被当作参数传给 request
    // onSuccess(data)
}

function add(x) {
    return function(y) { // function 被当作 add 的返回值
        return x + y;
    }
}

const hello = () => 'hello world'; // function 作为 value 被赋值给 hello 变量.
```

一种程序语言要支持 FP, 最少要符合 function 是一等公民这个条件, 才有办法用 FP 的手法来写代码.

#### 引用透明 (Referential Transparency)

在 FP 的世界里, function 是引用透明的, 引用透明指的是一个 expression 传入相同的参数, 不管运算几次, 永远会得到相同的返回值, 并且不会对外部世界造成任何改变 (即没有 Side Effect), 也就是说只要有相同的输入, 那输出就一定是可以预测的.

```javascript
const arr = [1, 2, 3];
arr.slice(0, 1); // return [1];
arr.slice(0, 1); // return [1];
// slice 是引用透明的, 不管执行几次, 只要传入的参数相同, 永远都会拿到相同的返回值.

arr.splice(0, 1); // return [1];
arr.splice(0, 1); // return [2];
// splice 不是引用透明的, splice 改变了 arr, 即对外部世界造成了改变.
```

引用透明的 Function 又可称为 Pure Function. 差别只在于纯函数指的是 Function 而引用透明则可以用在各种表达式上. 引用透明也可以理解为, 一个表达式可以直接替换成它的运算结果, 并且不会对整个程序有任何影响.

### 抽象的来看 Function

如果抽象的来看 Function, 其实 function 就是把一群可能的参数(集合)转换成一群输出(集合).

举例来说:
$$
f(1) = A
$$

$$
f(2) = B
$$

$$
f(3) = C
$$

![0201](assets/0201.png)

其实就是 `{1, 2, 3}` 的集合通过 function f 转换成了 `{A, B, C}` 的集合, 其中的重点在于传给 function f `1` 的时候, 返回值永远是 `A`.

相对的, 下面这个 function 就不符合 FP 定义的 function.
$$
f(1) = A
$$

$$
f(1) = B
$$

$$
f(2) = C
$$

![0202](assets/0202.png)

因为同样的 f function 输入 `1` 但返回值却有时候是 `A` 有时候是 `B`, 这就是不可预测且不合法的 function.

如果是不同的输入相同的输出, 则是合法的, 如下
$$
f(1) = A
$$

$$
f(2) = A
$$

$$
f(3) = A
$$

![0203](assets/0203.png)

这里 f 不管传入的是 `1`, `2` 还是 `3` 都会返回 `A`, 这是合法的, 因为我们只需要确保输入相同的参数, 永远会返回相同的值即可.

## 03: 我们的 Function 不一样

### 虽然都叫 Function 但不一样

在 Pure Functional Programming Language 的世界里, 所有 Function 都是 Pure Function, 不会也不能有任何副作用(Side Effect). 但在 Imperative Languages (如 JavaScript) 的世界里 Function 几乎不可避免地会有副作用, 因此虽然都叫 Function 但本质上是不一样的.

从 FP 的角度来说, Imperative Languages 里的 Function 应该称为 Procedure (程序), 因为我们可以在里面做任何事而不是单纯的运算和返回值.

### 什么是副作用 (Side Effect) ?

Side Effect 是指在运算的过程中, 改变了系统状态或是对外部世界进行了交互.

常见的 Side Effect 包括:

- 修改传入的参数
- 修改外部的状态
- 发送 HTTP Request
- DB 查询
- 打印 log
- 获取 Input
- DOM 查询
- 访问系统状态

其实上只要是改变系统状态或是跟真实世界产生交互的就是 Side Effect.

Side Effect 是造成 Bug 的主要来源之一, 所以我们要尽可能控制 Side Effect, 让他们存在于一个可控的范围内.

### Imperative Languages 世界中的 Function

在 Imperative Languages (如 JavaScript) 的世界里, 我们可以把 Function 简单区分为:

- Pure Function: 只做运算和返回, 没有 side effect.
- Impure Function: 
  - 只有 Effect 没有返回值
  - 有返回值, 同时有 Side Effect

```javascript
// Pure function
const add = (x, y) => x + y;
add(1, 2);

// Impure function
// 只有 Effect 没有返回值
const hello = () => {
    console.log('Hello World!');
}

// 有返回值, 并有 Side Effect
let isRequesting = false;
const getData = () => {
    if(!isRequesting) {
        isRequesting = true;
        return fetch(...)
    }
}
```

尽管在 JavaScript 世界中, 我们无法完全避免掉 Side Effect, 但我们可以通过一些手法来管理 Side Effect, 让 Side Effect 只作用在一定的范围内, 以确保程序能顺利运行! 在学习如何处理 Side Effect 之前, 先尽量避开具有 Side Effect 的 Function, 并尽可能地保持 Function Pure.

### 保持 Function Pure 的第一步 - Immutable

所有讲 FP 的资料都会提到 Immutable Data Structure, 所谓的 immutable data 就是一旦创建后就不会再改变的数据, 所有对于 immutable data 的操作都只是返回一个新的 immutable data. 注意 JavaScript 的原生对象都是 mutable 的.

```javascript
const a = {
    name: 'Jerry',
    age: 18
};
const b = a;
b.age = 19;
console.log(a); // {name: 'Jerry', age: 19}
console.log(a === b); // true
// 修改 b 的数据其实也同时修改了a
// b.age = 19 是一个 mutable 的操作
```

在上面的代码中, 使用 mutable 操作改变某个变量的数据时, 同时可能会造成别的变量数据也跟着改变, 这也是 bug 最可能产生的来源之一.

那如何让 JS 的数据结构变成 immutable 的呢? 一种方法是使用 [immutable.js](https://github.com/immutable-js/immutable-js) 库. 

```javascript
import { Map } from 'immutable';
const a = Map({a:1, b:2, c:3});
const b = a.set('b', 50);
console.log(a.toJS()); // {a: 1, b:2, c:3}
console.log(a === b); // false
// 修改 'b' 不会影响 a
// a.set('b', 50); 实际上是返回了一个新Map给b
```

在上面代码中, 对变量 `a` 的操作, 实际上是返回了一个新的对象, 原本的变量 `a` 是完全不受影响的, 这就是 immutable data!

当然使用 immutable.js 不能是缺点的, 因为首先有学习成本, 另外多数其他第三方 JS 包都只接受原生类型, 所以往往需要在原生类型和 immutable.js 类型中来回转换.

如果不使用 immutable.js 那如何确保数据是 immutable 的呢? 答案就是只使用 immutable 的方式来操作数据.

#### 1. 使用原生 Immutable 的数据操作

```javascript
const a = {
    name: 'Jerry',
    age: 18
}

// ES6
const b = {...a, age: 19};
// ES5
const c = Object.assign({}, a, {age: 19});

console.log(a); // {name: 'Jerry', age: 18}
console.log(a === b); // false
```

#### 2. 使用 Ramda 来操作复杂的数据

如果是较复杂的数据结构, 可以改用 Ramda 的 `assocPath` 或是 `dissocPath` 来操作.

```javascript
import * as R from 'ramda';
const a = {
    name: 'Jerry',
    age: 18,
    job: {
        company: 'Branch8',
        title: 'RD'
    }
}

// 复杂的数据结构使用扩展操作会有点麻烦
const b = {
    ...a,
    job: {
        ...a.job,
        title: 'Tech Lead'
    }
}

// 可以使用 Ramda 的 assocPath
const c = R.assocPath(['job', 'title'], 'Tech Lead', a);
```

#### 3. 确保团队不会使用 mutable 的方式操作数据

使用 ESLint

可以在 ESLint 的设置中加入 [eslint-;lugin-immutable](https://github.com/jhusain/eslint-plugin-immutable).

另外建立加入以下几个 rules

- [no-let](https://github.com/jhusain/eslint-plugin-immutable#no-let)
- [no-this](https://github.com/jhusain/eslint-plugin-immutable#no-this)
- [no-mutation](https://github.com/jhusain/eslint-plugin-immutable#no-mutation)
- [no-var](https://eslint.org/docs/rules/no-var)
- [no-param-reassign](https://eslint.org/docs/rules/no-param-reassign)

## 04: 为什么要纯 (Pure)

### 为什么要 Pure Function ?

#### 可预期 (确定性)

所有 Pure Function 的运行都是确定的, 即只要有相同的输入就能得到固定的输出, 不管执行几次在什么时间点执行都一样.

#### 容易理解

相较于 Impure Function 可能会受外部环境影响, Pure Function 因为没有外部环境影响, 则更容易理解该 Function 的行为.

```javascript
let isModifying = false;

// x 是一个 impure function
function x() {
    //...
    if(isModifying) {
        //...
    }
    //...
}
```

以上代码中, `x` function 直接存取了外部变量 `isModifying`, 所以会受到环境影响. 使得我们无法单纯的从 `x` function 内部得知它的行为, 因为我们还需要知道 `x` 是在什么时候被调用的, 以及 `isModifying` 有没有被修改, 什么时候被修改, 这让我们需要额外花许多时间才能理解整个程序的上下文 (Context) 的运行方式.

#### 可组合, 可分割, 可重用

因为 Pure Function 是可预期的, 这让我们可以组合各个小 Pure Function, 变成一个大的 Functoin. 也可以让一个大的 Pure Function 切割成小的 Pure Function, 而小的 Pure Function 就可以重复使用.

### Pure Function 带来什么优势?

#### 更轻松的除错 (Debug)

由于每个 Pure Function 都是可预期的, 不像 Impure Function 可能依赖于某个外部变量, 导致每次执行的结果可能不同, 所以在 Function 尽可能保持 Pure 的情况下, 是很容易很快速的找到 Bug 来源的, 甚至会大幅降低 Bug 的出现.

#### 更简单的测试 (Test)

由于 Pure Function 是可预期的, 这让我们在做单元测试时会变得非常容易, 只要确认输入和输出是否符合预期即可.

#### 可快取 (Cache)

由于 Pure Function 的确定性, 只要相同的输入必定会得到相同的输出, 那我们要做 Memory Cache 就会非常的容易, 只要透过一个 Object 或 Hash Map 把每次的输入当作 key 返回值当作 value, 并且在每次执行前去检查输入是否已经有 Cache , 如果有就直接取值返回, 如果没有则再执行 Function.

```javascript
const memoize = function(f) {
    const cache = {};
    return function(...args) {
        let key = JSON.stringify(args);
        cache[key] = cache[key] || f.apply(f, args);
        return cache[key];
    }
}
const add = (x, y) => x + y;
const memoizeAdd = memoize(add);
memoizeAdd(1, 2) // 3 将被cache, 之后每次调用memoizeAdd(1, 2) 都将直接返回缓存的结果 3
```

#### 可延迟运算 (Lazy Evaluation)

由于 Pure Function 的确定性, 不管在什么时间点执行, 只要相同的输入就会得到相同的输出, 这使我们可以让运算延迟的同时也不会影响运算结果! 而延迟运算可以帮助我们处理较大的数据, 并在写代码时更为容易.

JS 并没有天生的延迟运算的特性. 但可以参考 RxJS .

#### 可并行运算 (Parallelization)

最后一个最重要的优势是, 可以并行执行任何 Pure Function. 因为 Pure Function 不会依赖外部状态, 也就不需要共享内存 (不存在锁问题). 同时也不会有其他任何副作用, 因此不会有竞态条件 (race condition) 的问题.

## 05: 一切从 Array 说起

### Imperative 的世界

在一开始学习 JS 时, 只要学到 array 基本上就会跟着 for 循环一起学, 使用起来就像是下面这样的.

```javascript
const arr = [1, 2, 3];
for(let i = 0; i < arr.length; i++) {
    // do something...
}
```

`for(let i = 0; i < arr.length; i++)` 似乎变成了一个公式一直跟着我们, 每当我们需要操作 array, 就会使用 for (或 while).

假如有一组任务

```javascript
const taskArray = [
    {
        id: 1,
        userId: 1,
        userName: 'Jerry',
        complete: false,
        title: 'Think in FP',
        content: '...',
        dueDate: '2020-05-31',
        priority: 0
    },
    ...
]
```

这时候如果想要过滤出已经完成的资料, 可以这样写:

```javascript
const result = [];
for(let i = 0; i < taskArray.length; i++) {
    if(taskArray[i].complete) {
        result.push(taskArray[i]);
    }
}
```

完成后, 因为需要在不同的地方使用相同的逻辑, 这时我们就会想把它包成一个 function.

```javascript
function filterTaskArray(taskArray) {
    const result = [];
    for(let i = 0; i < taskArray.length; i++) {
        if(taskArray[i].complete) {
            result.push(taskArray[i]);
        }
    }
    return result;
}
```

但过了没多久, 可能某一种用到 `filterTaskArray` 的地方逻辑会变成, 除了要过滤出 complete 的 task 之外, 还需要过滤出某个特定的 userId, 所以有可能会变成这样:

```javascript
function filterTaskArray(taskArray, {filterComplete = false, filterUserId = undefined} = {}) {
    const result = [];
    for(let i = 0; i < taskArray.length; i++) {
        if(
        	(filterComplete && !taskArray[i].complete) ||
            (filterUserId != undefined && taskArray[i].userId !== filterUserId)
        ) {
            continue;
        }
        result.push(taskArray[i]);
    }
    return result;
}
```

`filterTaskArray`的使用方式变成

```javascript
const result = filterTaskArray(taskArray, {
    filterComplete: true,
    filterUserId: 1
});
```

到这里代码已经变得有点复杂了, 看 `filterTaskArray` 内部实现时可能都还要想一下, 如果这时候我们希望可以过滤到某个日期之后的 task 那就会变成:

```javascript
function filterTaskArray(taskArray, {filterComplete = false, filterUserId = undefined, filterDueDate = null} = {}) {
    const result = [];
    for(let i = 0; i < taskArray.length; i++) {
        if(
        	(filterComplete && !taskArray[i].complete) ||
            (filterUserId != undefined && taskArray[i].userId !== filterUserId) ||
            (filterDueDate != null && taskArray[i].dueDate <= filterDueDate)
        ) {
            continue;
        }
        result.push(taskArray[i]);
    }
    return result;
}
```

写到这里就会发现, 这里的抽象是非常糟糕的, 除了 `filterTaskArray` 整体实现上非常复杂之外, 过滤的条件也几乎有无限种可能, 每当有新的过滤条件就必须修改一次 `filterTaskArray`, 便维护成本变得非常高, 而且当条件越多时 API 也会显得越复杂, 对于使用这个 function 的人来说, 也很难使用.

### 抽象最小化

当我们把一段代码包成一个 function 时, 其实就是在作抽象化, 如果抽象化的不好就会让这个 function 极难维护, 也会让使用的人不知如何使用. 如果想要做一个好的抽象, 那我们应该让每次的抽象都尽可能的**小**, 并且把不必要的逻辑交给外部的使用者决定!

以前面的例子来说, 当我们希望一个 function 可以过滤出一个 array 的某些特定元素时, 我们需要抽象的只有一件事情就是**过滤 Array**, 至于是过滤什么, 条件是什么, 都应该由外部的使用者决定!

```javascript
function filterTaskArray(taskArray) { // 只过滤 array, 所以不应该限制是什么 array
    const result = [];
    for(let i = 0; i < taskArray.length; i++) {
        if(taskArray[i].complete) { // 条件应该由外部决定
            result.push(taskArray[i]);
        }
    }
    return result;
}
```

在 FP 的世界里, 要把部分逻辑交由外部的使用者决定是很简单的, 只需要要求使用者传入一个 function 进来, 并预期这个 function 会返回某种值就可以了, 在这里需要返回的是 Boolean 值.

```javascript
function filter(array, fn) { // function 改名为 filter, 参数改名为 array
    const result = [];
    for(let i = 0; i < arr.length; i++) {
        if(fn(array[i])) { // 传入array[i], 并预期fn(array[i]) 会返回 Boolean
            result.push(array[i]);
        }
    }
    return result;
}
```

此时要在什么条件下过滤什么东西就完全是由使用的人来决定了:

```javascript
const result = filter(taskArray, item => item.complete && item.userId = 1);
```

### Array 的定式

#### map

map 可以替换 array 的元素, 最后得到一个新的 array

```javascript
const arr = [1, 2, 3];
const result = arr.map(x => x + 1); // [2, 3, 4]
```

#### filter

filter 可以过滤 array 内的元素, 需要传入一个 function, 这个 function 要返回 boolean.

```javascript
const arr = [1, 2, 3];
const result = arr.filter(x => x % 2 === 0); // [2]
```

#### reduce

reduce 可以将数组化为单一值, 第一个参数是一个 function, 这个 function 会传入目前的状态以及 array 中的元素并返回下一个状态, 第二个参数是初始状态.

```javascript
const arr = [1, 2, 3];
const result = arr.reduce((acc, current) => acc + current, 0); // 6
```

#### flat

flat 会按照一个可指定的深度遍历数组, 并将所有元素与子数组中的元素合并为一个新数组返回.

```javascript
const arr = [1, 2, 3, [4, 5], [[6]]];
const result = arr.flat(1); // [1, 2, 3, 4, 5, [6]]
```

#### flatMap

flatMap 首先使用映射函数映射每个元素, 然后将结果压缩成一个新数组. 它与 map 连着深度值为 1 的 flat 几乎相同, 但 flatMap 通常效率上稍微高一些.

```javascript
const arr = [1, 2, 3, 4];
const result = arr.flatMap(x => [x * 2]); // [2, 4, 6, 8]
const arr1 = ["It's Sunny in", "", "California"];
arr1.flatMap(x => x.split(" ")); // ["It's", "Sunny", "in", "", "California"]
```

```javascript
const a = [5, 4, -3, 20, 17, -33, -4, 18];
//         |\  \  x   |   |\   x   x   |
//        [4,1, 4,   20, 16, 1,       18]
a.flatMap(n => 
         (n < 0) ? [] : 
          (n % 2 == 0) ? [n] : [n-1, 1]
         );
```

其他还包括 forEach, find, includes... 等, 这些方法都是 immutable 操作, 即他们不会对原始的 array 作出任何修改.

有一些 JS 原生的 array 方法是 mutable 的, 要**尽量避免使用**.

- push
- pop
- reverse
- shift
- sort
- splice
- unshift
- unwatch (非标准)
- watch (非标准)
- copyWithin

以上这些方法都是 mutable 的操作, 可以用其他 immutable 的方法代替.

```javascript
const arr = [1, 2, 3];
// ES5
const arr2 = arr.concat(4); // 取代 push
const arr3 = [0].concat(arr); // 取代 unshift
// ES6
const arr4 = [0, ...arr, 4]; // 取代 push 或 unshift
const [head, ...rest] = arr; // 取代 shift
const {[arr.length-1]: last} = arr; // 取代 pop

```

也可以限制 mutation 的操作在一个 function 内

```javascript
const safeSort = (arr, fn) => {
    const clone = [...arr]; // 复制一份, 避免 arr 被修改到
    clone.sort(fn);
    return clone;
}
```

这样一来就可以避免掉 mutable 的操作了. 只要够熟悉 array 的 map, filter, find, reducer...等方法, 基本上就不会再用到 for 循环了, 除非是非常复杂的算法要做极致的性能优化, 才有机会使用 for 循环.

### 练习

[Advent of Code 2019 Day 1 练习](https://adventofcode.com/2019/day/1)

有一组数字, 要对每个数字先**除以3**, 并**无条件舍去小数**, 然后再**减2**, 最后把每个数字**求和**.

用 imperative code 写的话大概会像下面这样:

```javascript
function calFuel(data) {
    let result = 0;
    for(let i = 0; i < data.length; i++) {
        const ans = Math.floor(data[i] / 3) - 2;
        result += ans;
    }
    return result;
}
```

用 FP 的方式来写的话:

```javascript
const result = data
	.map(x => x / 3) // 除以3
	.map(Math.floor) // 舍去小数
	.map(x => x - 2) // 减2
	.reduce((x, y) => x + y, 0); // 求和
```

