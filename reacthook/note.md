[参考资料](https://react.docschina.org/docs/hooks-intro.html)

# 1: Hook 简介

Hook 是 React 16.8 的新增特性. 最显著的改变就是可以让原来的无状态组件 (函数组件) 使用 state 以及其他的 React 特性.

[代码 1-example](src/1-example.js)

> 注意:
>
> React 16.8.0 是第一个支持 Hook 的版本.
>
> React Native 从 0.59 版本开始支持 Hook.

## 1. 没有破坏性改动

- 完全可选
- 100% 向后兼容

### 1-1 没有计划从 React 中移除 class.

有关 Hook 的渐进策略.

> Hook 和现有代码可以同时工作, 你可以渐进式地使用他们.

### 1-2 Hook 不会影响对 React 概念的理解.

Hook 为已知的 React 概念提供了更加直接的 API: props, state, context, refs 以及生命周期.

## 2. 动机

### 1-1 在组件之前利用**状态逻辑**很难

React 没有提供将可复用的行为**附加**到组件的途径 (如: 把组件连接到 store) . 之前解决这种问题的方案有 `render props` 和 `高阶组件`. 但这类方案需要重新组织组件结构, 这可能会很麻烦, 有时也会使代码难以理解. (嵌套地狱)  这说明了一个问题, React 需要为共享状态逻辑提供更好的**原生**途径.

现在可以使用 Hook 从组件中提供状态逻辑, 使得这些逻辑可以单独测试并利用. **Hook 使你在无需修改组件结构的情况下利用状态逻辑.** 这使得组件间或社区内共享 Hook 变得更便捷.

### 1-2 复杂组件变得难以理解

组件起初很简单, 但是逐渐会被**状态逻辑**和**副作用**充斥.每个生命周期常常包含一些不相关的逻辑.例如, 组件常常在 `componentDidMount` 和 `componentDidUpdate` 中获取数据. 但是, 同一个 `componentDidMount` 中可能也包含很多其他的逻辑, 如设置事件监听, 之后需要在 `componentWillUnmount` 中清除. 相互关联且需要对照修改的代码被进行了拆分, 而完全不相关的代码却在同一个方法中组合在一起. 如此很容易产生 bug, 并且导致逻辑不一致.

在多数情况下, 不可能将组件拆分为更小的粒度, 因为状态逻辑无处不在. 这也给测试带来了一定挑战. 同时, 这也是很多人将 React 和状态管理库结合使用的原因之一. 但这样也会导致引入很多抽象概念, 需要在不同的文件之间来回切换, 并使得利用变得更加困难.

为了解决这个问题, **Hook 将组件中相互关联的部分拆分成更小的函数 (比如设置订阅或请求数据)** , 而并非强制按照生命周期划分. 还可以使用 reducer 来管理组件的内部状态, 使其更加可预测.

### 1-3 难以理解的 class

class 是学习 React 的一大屏障. 必须理解 JavaScript 中 this 的工作方式, 这与其他语言存在巨大差异. 还不能忘记绑定事件处理器.

class 不能很好的压缩, 并且会使热重载出现不稳定的情况.

> 为了解决以上这些问题, Hook 使你在非 class 的情况下可以使用更多的 React 特性.
>
> 从概念上来讲, React 组件一直更像是函数. 而 Hook 则拥抱了函数, 同时也没有牺牲 React 的精神原则. Hook 提供了问题的解决方案, 而无需学习复杂的函数式或响应式编程技术.

# 2: Hook 概览

## 1. State Hook

[代码 1-example](src/1-example.js)

在上面代码中, `useState` 就是一个 Hook. 通过函数组件里调用它来给组件添加一些内部 state. React 会在重复渲染时保留这个 state. `useState` 会返回一对值: 当前状态和一个更新它的函数, 可以在事件处理函数或其他一些地方调用这个函数. 它类似 class 组件中的 `this.setState` , 但是它不会把新的 state 和旧的 state 进行合并.

`useState` 唯一的参数就是初始 state. 不同于 `this.state` , 这里的 state 不一定要是一个对象.

可以在一个组件中多次使用 State Hook:

```javascript
function ExampleWithManyStates() {
    // 声明多个 state 变量!
    const [age, setAge] = useState(42);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
}
```

**数组解构**的语法让我们在调用 `useState` 时可以给 state 变量取不同的名字.**React 假设当你多次调用  useState 的时候, 你能保证每次渲染它们的调用顺序不变**

## 2. 什么是 Hook?

Hook 是一些可以让你在函数组件里"钩入" React state 及生命周期等特性的函数. Hook 不能在 class 组件中使用.

React 内置了像 `useState` 这样的 Hook. 你也可以创建你自己的 Hook 来利用不同组件之间的状态逻辑.

## 3. Effect Hook

在 React 组件中执行数据获取, 订阅或者手动修改 DOM 的操作. 我们统一称为"副作用", 或者简称为"作用".

`useEffect` 就是一个 Effect Hook, 给函数组件增加了操作副作用的能力. 它跟 class 组件中的 `componentDidMount`, `componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途. 只不过被合并成了一个 API.

[代码 2-useeffect](src/2-useeffect.js)

当你调用 `useEffect` 时, 就是告诉 React 在完成对 DOM 的更改后运行你的"副作用"整数. 这个副作用函数是在组件内部声明的, 所以它可以访问到组件的 props 和 state. 默认情况下, React 会在 每次渲染后调用副作用函数--包括第一次渲染的时候.

副作用函数还可以通过返回一个函数来指定如何"清除"副作用.

```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);
    
    function handleStatusChange(status) {
        setIsOnline(status.isOnline); // 更新在线状态
    }
    
    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange); // 订阅事件
        
        // 返回的函数, 会在组件销毁时自动调用
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange); // 取消订阅
        }
    });
    
    if(isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}
```

React 会在组件销毁时取消对 ChatAPI 的订阅.

> 跟 useState 一样, 你可以在组件中多次使用 useEffect

## 4. Hook 使用规则

Hook 就是 JavaScript 函数, 但是使用它们会有两个额外的规则:

- 只能在函数最外层调用 Hook. 不要在循环, 条件判断或者子函数中调用.
- 只能在 React 的函数组件中调用 Hook. 不要在其他 JavaScript 函数中使用. (还有一个地方可以调用 Hook , 就是自定义的 Hook 中)

## 5. 自定义 Hook

有时候我们想要在组件之间复用一些状态逻辑. 目前为止, 有两种主流方案来解决问题: `高阶组件`和 `render props`. 自定义 Hook 可以让你在不增加组件的情况下达到同样的目的.

将订阅一个好友在线状态的逻辑抽取到一个叫做 `useFriendStatus` 的自定义 Hook 里:

```javascript
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
    const [isOnline, setIsOnline] = useState(null);
    
    function handleStatusChange(status) {
        setIsOnline(status.isOnline);
    }
    
    useEffect(() => {
        ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        }
    });
    
    return isOnline;
}
```

它将 `friendID` 作为参数, 并返回该好友是否在线.

现在我们可以在两个组件中使用它:

```javascript
function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);
    
    if(isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}
```

```javascript
function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);
    
    return (
    	<li style={{ color: isOnline ? 'green' : 'black' }}>
        	{props.friend.name}
        </li>
    );
}
```

这两个组件的 state 是完全独立的. Hook 是一种复用`状态逻辑`的方式, 它不复用 state 本身. 事实上 Hook 的每次调用都有一个完全独立的 state -- 因此你可以在单个组件中多次调用同一个自定义 Hook.

自定义 Hook 更像是一种约定而不是功能. 如果函数的名字以 "`use`" 开头并调用了其他 Hook, 我们就说这是一个自定义 Hook.

## 5. 其他 Hook

除此之外, 还有一些使用频率较低的但是很有用的 Hook. 比如 `useContext` 让你不使用组件嵌套就可以订阅 React 的 Context.

```javascript
function Example() {
    const local = useContext(LocalContext);
    const theme = useContext(ThemeContext);
    // ...
}
```

另外 `useReducer` 可以让你通过 reducer 来管理组件本地的复杂 state.

```javascript
function Todos() {
    const [todos, dispatch] = useReducer(todosReducer)
}
```

# 3: 使用 State Hook

