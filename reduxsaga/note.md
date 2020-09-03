[参考链接](https://redux-saga-in-chinese.js.org/)

# Redux Sage

## 01: 概述

redux-sage 是一个用于管理应用程序 Side Effect 的 library, 它的目标是让副作用管理更容易, 执行更高效, 测试更简单, 在处理故障时更容易.

可以想像为, 一个 sage 就像是应用程序中的一个单独的线程, 它独自负责处理副作用. redux-sage 是一个 redux 的中间件, 意味着这个线程可以通过正常的 redux action 从主应用程序启动, 暂停和取消, 它也能访问完整的 redux state, 也可以 dispatch redux action.

redux-sage 使用了 ES6 的 Generator 功能, 让异步的流程更易于读取, 写入和测试. 通过 Generator 让异步的流程看起来就像是标准的同步 JavaScript 代码. (有点像 async / await, 但 Generator 还有一些更棒而且我们也需要的功能).

不同于 redux-thunk, 你不会再遇到回调地狱, 你可以很容易地测试异步流程并保持你的 action 是干净的.

### 01-00: Generator 介绍

[JavaScript Generators 权威指南](https://github.com/gajus/gajus.com-blog/blob/master/posts/the-definitive-guide-to-the-javascript-generators/index.md)

[ES6 Generators 基础](https://davidwalsh.name/es6-generators)

[深入 ES6 generators](https://2ality.com/2015/03/es6-generators.html)

[3 cases where JavaScript generators rock](https://goshakkk.name/javascript-generators-understanding-sample-use-cases/)