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

**数组解构**的语法使得调用 `useState` 时可以给 state 变量取不同的名字.**React 假设当你多次调用  useState 的时候, 你能保证每次渲染它们的调用顺序不变**

## 2. 什么是 Hook?

Hook 是一些可以让你在函数组件里"钩入" React state 及生命周期等特性的函数. Hook 不能在 class 组件中使用.

React 内置了像 `useState` 这样的 Hook. 你也可以创建你自己的 Hook 来利用不同组件之间的状态逻辑.

## 3. Effect Hook

在 React 组件中执行数据获取, 订阅或者手动修改 DOM 的操作. 统一被称为"副作用", 或者简称为"作用".

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

有时候想要在组件之间复用一些状态逻辑. 目前为止, 有两种主流方案来解决问题: `高阶组件`和 `render props`. 自定义 Hook 可以让你在不增加组件的情况下达到同样的目的.

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

现在可以在两个组件中使用它:

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

自定义 Hook 更像是一种约定而不是功能. 如果函数的名字以 "`use`" 开头并调用了其他 Hook, 那就称其为是一个自定义 Hook.

## 6. 其他 Hook

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

## 1. 等价的 class 示例

[代码 1-example](src/1-example.js)

之前的 State Hook 示例可以用 class 写成如下代码:

```javascript
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }
    
    render() {
        return (
        	<div>
            <p>You Clicked {this.state.count} times</p>
		   <button onClick={()=>{this.setState({count:this.state.count+1})}}>Click me</button>
            </div>
        );
    }
}
```

## 2. Hook 和函数组件

React 的函数组件是这样的:

```javascript
const Example = (props) => {
    // 你可以在这里使用 Hook
    return <div />;
}
```

或者是这样:

```javascript
function Example(props) {
	// 你可以在这里使用 Hook
    return <div />;
}
```

之前把以上组件又叫做"无状态组件". 但现在可以借用 Hook 引入使用 React state 的能力, 所以称它们为"函数组件"更合适.

> Hook 在 class 内部是不起作用的. 但你可以使用它们取代 class

## 3. Hook 是什么?

### 3-1 Hook 是什么?

Hook 是一个特殊的函数, 它可以"钩入" React 的特性. 例如, `useState` 是允许你在 React 函数组件中添加 state 的 Hook.

### 3-2 什么时候使用 Hook ?

如果在编写函数组件并意识到需要向其添加一些 state, 之前的做法是必须将它转化为 class. 现在则可以在现有的函数组件中使用 Hook.

## 4. 声明 State 变量

在 class 中, 通过在构造函数中设置 `this.state` 为 `{ count: 0 }` 来初始化 `count` state 为 `0`:

```javascript
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }
}
```

在函数组件中, 没有 `this` , 所以不能分配或读取 `this.state` . 现在可以直接在组件中调用 `useState` Hook:

```javascript
import React, { useState } from 'react';
function Example() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
}
```

### 4-1 调用 `useState` 方法的时候做了什么?

它定义了一个 "state 变量". 暂且把这个变量叫做 `count`, 当然可以叫他任何名字. 这是一种在函数调用时保存变量的方式 -- `useState` 是一种新方法, 它与 class 里面的 `this.state` 提供的功能完全相同. 一般来说, 在函数退出后变量就会"消失", 但在 state 中的变量会被 React 保留.

### 4-2 useState 需要哪些参数?

`useState()` 方法里面唯一的参数就是初始 state. 不同于 class 的是, 可以按照需要使用的是数字或字符串对其进行赋值, 而不一定是对象.

### 4-3 useState 方法的返回值是什么?

返回值为: 当前 state 以及更新 state 的函数. 就像之前代码中写的 `const [count, setCount] = useState()`, 这与 class 里面的 `this.state.count` 和 `this.setState` 类似, 唯一区别就是你需要**成对**的获取它们.

> 注意: 
>
> 你可能想知道: 为什么叫 useState 而不叫 createState ?
>
> "Create" 可能不是很准确, 因为 state 只在组件首次渲染的时候被创建. 在下一次重新渲染时, useState 会返回当前的 state. 否则它就不是 "state" 了! 这也是 Hook 的名字总是以 use 开头的一个原因.

## 5. 读取 state

想在 class 中显示当前的 count, 可以读取 `this.state.count`:

```
<p>You Clicked {this.state.count} times</p>
```

在函数中, 则可以直接用 `count`:

```
<p>You clicked {count} times</p>
```

## 6. 更新 state

在 class 中, 需要调用 `this.setState()`来更新 `count`值:

```
<button onClick = {() => this.setState({ count: this.state.count + 1 })}>
Click me
</button>
```

在函数中, 已经有了 `setCount`和 `count`变量, 所以不需要 `this`:

```
<button onClick = {() => setCount(count + 1)}>
Click me
</button>
```

## 7. 提示:  方括号有什么用?

可能注意到了用方括号定义了一个 state 变量

```
const [count, setCount] = useState(0);
```

等号左边名字并不是 React API 的部分, 你可以自己取名字.

这里的 [] 其实是 JavaScript 语法叫**数组解构**. 这意味着同时创建了 `count`和 `setCount`两个变量, `count`的值为 `useState`返回的第一个值, `setCount`是返回的第二个值. 它等价于下面的代码:

```javascript
const countStateVariable = useState(0); // 返回一个有两个元素的数组
const count = countStateVariable[0]; // 数组里的第一个值
const setCount = countStateVariable[1]; // 数组里的第二值
```

## 8. 提示: 使用多个 state 变量

```javascript
function ExampleWithManyStates() {
    // 声明多个 state 变量
    const [age, setAge] = useState(42);
    const [fruit, setFruit] = useState('banana');
    const [todos, setTodos] = useState([{text: '学习 Hookk'}]);
    
    // 这个组件中有局部变量 age, fruit, todos, 可以只单独更新其中的一个:
    function handleOrangeClick() {
        // 和 this.setState({fruit: 'orange'}) 类似
        setFruit('orange');
    }
}
```

Hook State 变量也可以很好的存储对象和数组, 因此你仍然可以将相关数据分为一组. 然而, 不像 class 中的 `this.setState`, 更新 state 变量总是**替换**它而不是*合并*它.

# 4: 使用 Effect Hook

Effect Hook 可以在函数组件中执行副作用操作

[代码 2-useeffect](src/2-useeffect.js)

> 数据获取, 设置订阅以及手动更改 React 组件中的 DOM 都属于副作用.
>
> 如果熟悉 React class 的生命周期函数, 你可以把 useEffect Hook 看做 componentDidMount, componentDidUpdate 和 componentWillUnmount 这三个函数的组合.

在 React 组件中有两种常见副作用操作: 需要清除的和不需要清除的.

## 1. 无需清除的 effect

有时候, 只想**在 React 更新 DOM 之后运行一些额外的代码**. 比如发送网络请求, 手动更改 DOM, 记录日志等. 这些都是常见的无需清除的操作. 因为在执行完这些操作之后, 就可以忽略他们了. 对比一下使用 class 和 Hook 都是怎么实现这些副作用的.

### 1-1 使用 Class 的示例

在 React 的 class 组件中,  `render` 函数是不应该有任何副作用的. 一般来说, 在这里执行操作太早了, 基本上都希望在 React 更新 DOM 之后才执行一些操作.

这就是为什么在 React class 中, 一般会把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中.

```javascript
// class example
// ...
componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
}
componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
}
// ...
```

**注意, 在这个 class 中, 需要在两个生命周期函数中编写重复的代码.**

这是因为很多情况下, 都希望在组件加载和更新时执行同样的操作. 从概念上说, 其实就是希望它在每次渲染之后执行, 但 React 的 class 组件没有提供这样的方法. 即使提取出一个方法, 还是要在两个地方调用它.

### 1-2 使用 Hook 的示例

```javascript
function Example() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `You clicked ${count} times`;
    });
    // ...
}
```

#### 1-2-a: useEffect 做了什么?

通过使用 useEffect 这个 Hook, 等于告诉 React 组件需要在渲染后执行某些操作. React 会保存你传递的函数 (一般称之为 "effect"), 并且在执行 DOM 更新之后调用它.

#### 1-2-b: 为什么在组件内部调用 useEffect?

将 `useEffect` 放在组件内部使得在 effect 中可以直接访问 `count` state 变量 (或其他 props). 不需要特殊的 API 来读取它, 它已经保存在函数作用域中. Hook 使用了 JavaScript 的闭包机制, 而不用在 JavaScript 已经提供了解决方案的情况下, 还引入其它特定的 React API.

*就像 React 在 UI 中使用 {if} 来处理逻辑判断语句一样, React 的特点就是尽量使用已有的方案去解决问题, 对比 Vue 的 v:if 这种可以减少学习成本.*

#### 1-2-c: useEffect 会在每次渲染后都执行吗?

默认情况下是的, 它在第一次渲染之后和每次更新之后都会执行. 你可能会更容易接受 effect 发生在"渲染之后"这种概念, 不用再去考虑"挂载"还是"更新". React 保证了每次运行 effect 的同时, DOM 都已经更新完毕.

> 要注意的是, 传递给 `useEffect` 的函数在每次渲染中都会有所不同, 这是刻意为之的. 事实上这正是可以在 effect 中获取最新的 `count` 的值, 而不用担心其过期的原因. 每次重新渲染, 都会生成新的 effect, 替换掉之前的. 某种意义上讲, effect 更像是渲染结果的一部分, 每个 effect "属于"一次特定的渲染.

> 与 `componentDidMount` 或 `componentDidUpdate` 不同, 使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕, 这让你的应用看起来响应更快. 大多数情况下, effect 不需要同步地执行, 在个别情况下 (例如测量布局), 有单独的 `useLayoutEffect` Hook 供你使用, 其 API 与 `useEffect` 相同.

## 2. 需要清除的 effect

有些副作用是需要清除的, 例如**订阅外部数据源**. 这种情况下, 清除工作是非常重要的, 可以防止引起内存泄漏!

### 1-1 使用 Class 的示例

在 React class 中, 通常会在 `componentDidMount` 中设置订阅, 并在 `componentWillUnmount` 中清除它. 例如, 假设有一个 `ChatAPI` 模块, 它被用来订阅好友的在线状态.

```javascript
// class example
// ...
componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
    );
}
componentWillUnmont() {
    ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
    );
}
handleStatusChange(status) {
    this.setState({ isOnline: status.isOnline });
}
// ...
```

你会注意到 `componentDidMount` 和 `componentWillUnmount` 之间相互对应. 使用生命周期函数只能拆分这些逻辑代码, 即使这两部分代码都作用于相同的副作用.

> 注意: 这个示例还需要编写 `componentDidUpdate` 方法才能保证完全正确. 目前先忽略这一点. (3-2)

### 1-2 使用 Hook 的示例

由于添加和删除订阅的代码的紧密性, 所以 `useEffect` 的设计是在同一个地方执行. 如果你的 effect 返回一个函数, React 将会在执行清除操作时调用它.

```javascript
function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);
    useEffect(() => {
        function handleStatusChange(status) {
            setIsOnline(status.isOnline);
        }
        ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
        return function cleanup() {
            ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        }
    });
    if(isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}
```

#### 1-2-a: 为什么要在 effect 中返回一个函数?

这是 effect 可选的清除机制. 每个 effect 都可以返回一个清除函数. 如此可以将添加和移除订阅的逻辑放在一起. 它们都属于 effect 的一部分.

#### 1-2-b: React 何时清除 effect?

React 会在组件卸载的时候执行清除操作. 正如之前所讲, effect 在每次渲染的时候都会执行. 这就是为什么 React 会在执行当前 effect 之前对上一个 effect 进行清除. 稍后将讨论<!--为什么这将助于避免 bug--> 以及<!--如何在遇到性能问题时跳过此行为-->.

## 3. 使用 Effect 的提示

### 3-1 使用多个 Effect 实现关注点分离

使用 Hook 其中一个目的就是解决 class 中生命周期函数经常包含不相关的逻辑, 但又把相关逻辑分离到了几个不同方法中的问题.

Hook 允许按照代码的用途分离他们, 而不是像生命周期函数那样.

### 3-2 为什么每次更新的时候都要运行 Effect

在之前的 class 示例的最后已经提到了, 当组件的 friend prop 发生变化时, 需要添加 `componentDidUpdate` 来解决仍然展示原来好友状态的 bug.

```javascript
componentDidUpdate(prevProps) {
    // 取消订阅之前的 friend.id
    ChatAPI.unsubscribeFromFriendStatus(
        prevProps.friend.id,
        this.handleStatusChange
    );
    // 订阅新的 friend.id
    ChatAPI.subscribeToFriendStatus(
        this.propos.friend.id,
        this.handleStatusChange
    );
}
```

忘记正确地处理 `componentDidUpdate` 是 React 应用中觉的 bug 来源.

而 Hook 版本不会受到此 bug 影响. 因为 `useEffect` 默认就会处理. 它会在调用一个新的 effect 之前对前一个 effect 进行清理.

```
Mount with { id: 100 } props
会运行第一个 effect
Update with { id: 200 } props
会清除上一个 effect, 再运行下一个 effect
Update with { id: 300 } props
会清除上一个 effect, 再运行下一个 effect
...
Unmount
清除最后一个 effect
```

### 3-3 通过跳过 Effect 进行性能优化

在某些情况下, 每次渲染后都执行清理或者执行 effect 可能会导致性能问题. 在 class 组件中, 可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决.

```javascript
componentDidUpdate(prevProps, prevState) {
    if(prevState.count !== this.state.count) {
        document.title = `You clicked ${this.state.count} times`;
    }
}
```

这是很常见的需求, 所以它被内置到了 `useEffect` 的 Hook API 中. 如果某些特定值在两次重渲染之前没有发生变化, 你可以通知 React 跳过对 effect 的调用, 只要传递数组作为 `useEffect` 的第二个可选参数即可.

```javascript
useEffect(() => {
    document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
}, [props.friend.id]); // 对于有清除操作的 effect 同样适用, 仅在 props.friend.id 发生变化时, 才重新订阅
```

> 注意:
>
> 如果你要使用此优化方式, 请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**.
>
> 如果想执行只运行一次的 effect (仅在组件挂载和卸载时执行), 可以传递一个空数组([]) 作为第二个参数. 这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值, 所以它永远都不需要重复执行.
>
> 如果你传入了一个空数组([]), effect 内部的 props 和 state 就会一直拥有其初始值, 尽管这样做更接近大家熟悉的 `componentDidMount` 和 `componentWillUnmount` 思维模式, 但其实有更好的方式来避免过于频繁的重复调用 effect.(参考后续 Hooks FAQ)

# 5. Hook 规则

Hook 本质就是 JavaScript 函数, 但是在使用它时需要遵循两条规则.

## 1. 只在最顶层使用 Hook

**不要在循环, 条件或嵌套函数中调用 Hook,** 确保总是在你的 React 函数的最顶层调用他们. 遵守这条规则, 你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用. 这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确.

## 2. 只在 React 函数中调用 Hook

**不要在普通的 JavaScript 函数中调用 Hook.**

你可以:

- 在 React 的函数组件中调用 Hook
- 在自定义 Hook 中调用其他 Hook

```javascript
// React 怎么知道哪个 state 对应哪个 useState ? 答案是 React 靠的是 Hook 调用的顺序.
// 首次渲染
useState('Mary') // 1. 使用 'Mary' 初始化变量名为 name 的 state
useEffect(persistForm) // 2. 添加 effect 以保存 form 操作
useState('Poppins') // 3. 使用 'Poppins' 初始化变量名为 surname 的 state
useEffect(updateTitle) // 4. 添加 effect 以更新标题
// 二次渲染
useState('Mary') // 1. 读取变量名为 name 的 state (参数被忽略)
useEffect(persistForm) // 2. 替换保存 form 的 effect
useState('Poppins') // 3. 读取变量名为 surname 的 state (参数被忽略)
useEffect(updateTitle) // 4. 替换更新标题的 effect
```

只要 Hook 的调用顺序在多次渲染之间保持一致, React 就能正确地将内部 state 和对应的 Hook 进行关联.

```javascript
useState('Mary'); // 1. 读取变量名为 name 的 state (参数被忽略)
// 在条件语句中使用 Hook 违反第一条规则
if(name !== '') {
    useEffect(...); // 此 Hook 被忽略!
}
useState('Poppins'); // 2 (之前为3). 读取变量名为 surname 的 state 失败

// 上面的写法, 每次渲染时执行的顺序是不确定的, 会导致后续的 Hook 失败
// 这就是为什么 Hook 需要在组件的最顶层调用. 如果想要有条件地执行一个 effect, 可以将判断放到 Hook 的内部
useEffect(() => {
    if(name !== '') {
        localStorage.setItem('formData', name);
    }
});
```

# 6. 自定义 Hook

通过自定义 Hook, 可以将组件逻辑提取到可重用的函数中.

如果现在有多个组件想要共享逻辑(比如之前做的订阅好友在线状态的逻辑), 目前在 React 中有两种流行的作法: render props 和高阶组件, 现在来看看 Hook 是如何在不增加组件的情况下解决相同问题的.

## 1. 提取自定义 Hook

如果想在两个函数之间共享逻辑时, 可以把它提取到第三个函数中, 而组件和 Hook 都是函数, 所以也同样适用这种方式.

自定义 Hook 是一个函数, 其名称以 "use" 开头, 函数内部可以调用其他的 Hook.

```javascript
function useFriendStatus(friendID) {
    const [isOnline, setIsOnline] = useState(null);
    useEffect(() => {
        function handleStatusChange(status) {
            setIsOnline(status.isOnline);
        }
        ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
        return () => {
            ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
        };
    });
    return isOnline;
}
```

与 React 组件不同的是, 自定义 Hook 不需要具有特殊的标识. 可以自由的决定它的参数是什么, 以及它应该返回什么 (如果需要的话). 换句话说, 它就像一个正常的函数. 但是它的名字应该始终以 `use` 开头, 这样可以一眼看出其符合 Hook 的规则.

## 2. 使用自定义 Hook

现在就可以在需要知道好友是否在线的组件中使用自定义 Hook 了.

```javascript
function FriendStatus(props) {
    const isOnline = useFriendStatus(props.friend.id);
    if(isOnline === null) {
        return 'Loading...';
    }
    return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
    const isOnline = useFriendStatus(props.friend.id);
    return (
        <li style={{color:isOnline?'green':'black'}}>
        	{props.friend.name}
        </li>
    );
}
```

**自定义 Hook 是一种自然遵循 Hook 设计的约定, 而并不是 React 的特性**

### 2-1 自定义 Hook 必须以 "use" 开头吗?

**必须如此**. 这个约定非常重要. 不遵循的话, 由于无法判断某个函数是否包含对其内部 Hook 的调用, React 将无法自动检查自定义 Hook 是否违反了 Hook 的规则.

### 2-2 在两个组件中使用相同的 Hook 会共享 state 吗?

**不会**. 自定义 Hook 是一种重用*状态逻辑*的机制(例如设置为订阅并存储当前值). 所以每次使用自定义 Hook 时, 其中的所有 state 和副作用都是完全隔离的.

### 2-3 自定义 Hook 如何获取独立的 state?

每次调用 Hook, 它都会获取独立的 state. 由于直接调用了 `useFriendStatus`, 从 React 的角度来看, 这个组件只是调用了 `useState` 和 `useEffect`. 和之前了解到的一样, 可以在一个组件中多次调用 `useState` 和 `useEffect`, 它们是完全独立的.

## 3. 在多个 Hook 之间传递信息

由于 Hook 本身就是函数, 因此可以在它们之间传递信息.

```javascript
function ChatRecipientPicker() {
    const [recipientID, setRecipientID] = useState(1);
    const isRecipientOnline = useFriendStatus(recipientID);
    return(
        <>
			<Circle color={isRecipientOnline ? 'green' : 'red'} />
			<select
				value={recipientID}
				onChange={e => setRecipientID(Number(e.target.value))}
			>
				{friendList.map(friend => (
                 	<option key={friend.id} value={friend.id}>{friend.name}</option>
				))}
			</select>
        </>
    );
}
```

首先将当前选择的好友 ID 保存在 `recipientID` 状态变量中, 并在用户从 `<select>` 中选择其他好友时更新这个 state.

由于 `useState` 提供了 `recipientID` 状态变量的最新值, 因此可以将它作为参数传递给自定义的 `useFriendStatus` Hook.

如此就能够知道当前选中的好友是否在线. 当用户选择不同的好友并更新 `recipientID` 状态变量时, `useFriendStatus` Hook 将会取消订阅之前选中的好友, 并订阅新选中的好友状态.

## 4. useYourImagination()

复杂的组件会包含大量以特殊方式来管理的内部状态. `useState` 并不会使得集中更新逻辑变得容易, 此时可能更愿意用 redux 中的 reducer 来编写.

Reducers 非常便于单独测试, 且易于扩展, 以表达复杂的更新逻辑. 如有必要, 可以将它们分成更小的 reducer. 但是有时可能还是想用 React 内部的 state, 或者可能根本不想安装其它库.

此时完全可以自己编写一个 `useReducer` 的 Hook, 使用 reducer 的方式来管理组件的内部 state. 其简化版本可能如下所示:

```javascript
function useReducer(reducer, initialState) {
    const [state, setState] = useState(initialState);
    function dispatch(action) {
        const nextState = reducer(state, action);
        setState(nextState);
    }
    return [state, dispatch];
}
```

接下来在组件中使用它:

```javascript
function Todos() {
    const [todos, dispatch] = useReducer(todosReducer, []);
    function handleAddClick(text) {
        dispatch({type:'add', text});
    }
}
```

在复杂组件中使用 reducer 管理内部 state 的需求很常见, `useReducer` 的 Hook 已经内置到 React 中.

# 7. Hook API

## 1. 基础 Hook

### 1-1 useState

```javascript
const [state, setState] = useState(initialState);
```

返回一个 state, 以及更新 state 的函数.

在初始渲染期间, 返回的状态 (state) 与传入的第一个参数 (initialState) 值相同.

`setState` 函数用于更新 state. 它接收一个新的 state 值并将组件的一次重新渲染加入队列.

```
setState(newState);
```

在后续的重新渲染中, `useState` 返回的第一个值将始终是更新后最新的 state.

> 注意: React 会确保 `setState` 函数的标识是稳定的, 并且不会在组件重新渲染时发生变化.

#### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出, 那么可以将函数传递给 `setState`. 该函数将接收先前的 state, 并返回一个更新后的值.

```javascript
function Counter({initialCount}) {
    const [count, setCount] = useState(initialCount);
    return (
    	<>
        	Count: {count}
			<button onClick={()=>setCount(initialCount)}>Reset</button>
			<button onClick={()=>setCount(prevCount => prevCount-1)}>-</button>
			<button onClick={()=>setCount(prevCount => prevCount+1)}>+</button>
        </>
    );
}
```

"+" 和 "-" 按钮采用函数式形式, 因为被更新的 state 需要基于之前的 state. 但是 "reset" 按钮则采用普通形式, 因为它总是把 count 设置回初始值.

> 注意: 与 class 组件中的 `setState` 方法不同, `useState` 不会自动合并更新对象. 可以使用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果.
>
> `useReducer` 是另一种可选方案, 它更适用于管理包含多个子值的 state 对象.

#### 惰性初始 state

`initialState` 参数只会在组件的初始渲染中起作用, 后续渲染时会被忽略. 如果初始 state 需要通过复杂计算获得, 则可以传入一个函数,  在函数中计算并返回初始的 state, 此函数只在初始渲染时被调用.

```javascript
const [state, setState] = useState(() => {
    const initialState = somExpensiveComputation(props);
    return initialState;
});
```

#### 跳过 state 更新

调用 State Hook 的更新函数并传入当前的 state 时, React 将跳过子组件的渲染及 effect 的执行. (React 使用 `Object.is` 比较算法来比较 state).

需要注意的是, React 可能仍需要在跳过渲染前渲染该组件. 不过由于 React 不会对组件树的"深层"节点进行不必要的渲染, 所以大可不必担心. 如果在渲染期间执行了高开销的计算, 则可以使用 `useMemo` 来进行优化.

### 1-2 useEffect

```
useEffect(didUpdate);
```

该 Hook 接收一个包含命令式, 且可能有副作用代码的函数.

在函数组件主体内(这里指在 React 渲染阶段) 改变 DOM, 添加订阅, 设置定时器, 记录日志以及执行其他包含副作用的操作都是不被允许的, 因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性.

使用 `useEffect` 完成副作用操作. 赋值给 `useEffect` 的函数会在组件渲染到屏幕之后执行. 你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道.

默认情况下, effect 将在每轮渲染结束后执行, 但也可以选择让它*在只有某些值改变的时候*才执行.

#### 清除 effect

通常, 组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源. 要实现这一点, `useEffect` 函数需返回一个清除函数.

```javascript
useEffect(() => {
    const subscription = props.source.subscribe();
    return () => {
        // 清除订阅
        subscription.unsubscribe();
    };
});
```

为防止内存泄漏, 清除函数会在组件卸载前执行. 另外, 如果组件多次渲染(通常如此), 则**在执行下一个 effect 之前, 上一个 effect 就已被清除.** 在上述示例中, 意味着组件的每一次更新都会创建新的订阅. 若想避免每次更新都触发 effect 的执行, 请参阅下一小节(effect 的条件执行).

#### effect 的执行时机

与 `componentDidMount`, `componentDidUpdate` 不同的是, 在浏览器完成布局与绘制之后, 传给 `useEffect` 的函数会延迟调用. 这使得它适用于许多常见的副作用场景, 比如设置订阅和事件处理等情况, 因此不应在函数中执行阻塞浏览器更新屏幕的操作.

然而, 并非所有 effect 都可以被延迟执行. 例如, 在浏览器执行下一次绘制前, 用户可见的 DOM 变更就必须同步执行, 这样用户才不会感觉到视觉上的不一致. React 为此提供了一个额外的 `useLayoutEffect` Hook 来处理这类 effect. 它和 `useEffect` 的结构相同, 区别只是调用时机不同.

虽然 `useEffect` 会在浏览器绘制后延迟执行, 但会保证在任何新的渲染前执行. React 将在组件更新前刷新上一轮渲染的 effect.

#### effect 的条件执行

默认情况下, effect 会在每轮组件渲染完成后执行. 这样的话, 一旦 effect 的依赖发生变化, 它就会被重新创建.

然而, 在某些场景下这么做可能会矫枉过正. 比如, 在上一章节的订阅示例中, 其实并不需要每次组件更新时都创建新的订阅, 而是仅需要在 `source` props 改变时重新创建.

要实现这一点, 可以给 `useEffect` 传递第二个参数, 它是 effect 所依赖的值数组.

```javascript
useEffect(
    () => {
        const subscription = props.source.subscribe();
        return () => {
            subscription.unsubscribe();
        };
    },
    [props.source] // 只有当 props.source 改变后才会重新创建订阅
);
```

> 注意: 如果想执行只运行一次的 effect (仅在组件挂载和卸载时执行), 可以传递一个空数组 ([]) 作为第二个参数.

### 1-3 useContext

```javascript
const value = useContext(MyContext);
```

接收一个 context 对象 (`React.createContext` 的返回值) 并返回该 context 的当前值. 当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定.

当组件上层最近的 `<MyContext.Provider>` 更新时, 该 Hook 会触发重渲染, 并使用最新传递给 `MyContext` provider 的 context `value` 值.

别忘记 `useContext` 的参数必须是 context 对象本身.

> 提示: 如果在接触 Hook 前已经对 context API 比较熟悉, 那应该可以理解, `useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`.
>
> `useContext(MyContext)` 只是提供了一种能够读取 context 的值以及订阅 context 的变化的方法. 具体使用时, 仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件提供 context.

[代码 7-usecontext](src/7-usecontext.js)

## 2. 额外的 Hook

### 2-1 useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

它是 `useState` 的替代方案. 它接收一个形如 (state, action) => newState 的 reducer, 并返回当前的 state 以及与其配套的 dispatch 方法.

#### 何时使用 useReducer 替代 useState ?

- 在某些场景下, useReducer 会比 useState 更适用, 例如 state 逻辑较复杂且包含多个子值, 或者下一个 state 依赖于之前的 state 等.
- 使用 useReducer 还能给那些会触发深更新的组件做性能优化, 因为<u>你可以向子组件传递 dispatch 而不是回调函数</u>. (具体原因参考后面小节: 如何避免向下传递回调?)

[代码 7-usereducer](src/7-usereducer.js)

> 注意: React 会确保 dispatch 函数的标识是稳定的, 并且不会在组件重新渲染时改变.

#### 指定初始 state

最简单的方法就是将初始 state 作为第二个参数传入 `useReducer`.

> 注意: React 不使用 state = initialState 这一套由 Redux 推广开来的参数约定, 当然如果特别喜欢这种参数约定, 可以通过调用 useReducer(reducer, undefeind, reducer) 来模拟.

#### 惰性初始化

也可以选择惰性创建初始 state. 为此, 需要将 init 函数作为 useReducer 的第三个参数传入.

```javascript
function init(initialCount) {
	return {count: initialCount}
}
// ... reducer
// ... function component
const [] = useReducer(reducer, initialCount, init);
```

#### 跳过 dispatch

和 useState 类似, 如果 Reducer Hook 的返回值与当前的 state 相同, React 也会跳过子组件的渲染及副作用的执行.

### 2-2 useCallback

```javascript
const memoizedCallback = useCallback(
	() => {
        doSomething(a,b);
    },
    [a, b]
);
```

这样将返回一个 memoized 回调函数. 该回调函数仅在某个依赖项改变时才会更新. 当把这个回调函数传递给使用相同的依赖项而避免非必要渲染的子组件时, 会非常有用.

> useCallback(fn, deps) 相当于 useMemo(() => fn, deps) .

### 2-3 useMemo

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

将返回一个 memoized 值. 把 "创建" 函数和依赖项数组作为参数传入 useMemo , 它仅会在某个依赖项改变时才重新计算 memoized 值. 这种优化有助于避免在每次渲染时都进行高开销的计算.

> 注意: 
>
> 传入 useMemo 的函数会在渲染期间执行. 不要在这个函数内部执行与渲染无关的操作, 诸如副作用这类的操作属于 useEffect 的适用范畴, 而不是 useMemo.
>
> 如果没有提供依赖项数组, useMemo 在每次渲染时都会计算新的值.
>
> 可以把 useMemo 作为性能优化的手段, 但不要把它当成语义上的保证. 将来, React 可能会选择 "遗忘" 以前的一些 memoized 值, 并在下次渲染时重新计算它们, 比如为离屏组件释放内存. (所以 useMemo 在一个生命周期内, 即使依赖项一直是相同的, 它也不能保证只执行一次, 所以 useMemo 可以作为性能优化的手段, 但可能并不能满足仅调用一次这样的业务需求)

### 2-4 useRef

```javascript
const refContainer = useRef(initialValue);
```

useRef 返回一个可变的 ref 对象, 其 `.current`属性被初始化为传入的参数 (initialValue) . 返回的 ref 对象在组件的整个生命周期内保持不变.

一个常见的用例便是命令式地访问子组件:

[代码 7-useref](src/7-useref.js)

本质上, useRef 就像是可以在其 .current 属性中保存一个可变值的 "盒子".

当 ref 对象内容发生变化时, useRef 并*不会发送通知*. 变更 `.current` 属性不会引发组件重新渲染. 如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码, 则需要使用 <u>回调 ref</u> *(参考8. 2-11 我该如何测量 DOM 节点? )* 来实现.

### 2-5 useImperativeHandle

```javascript
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle`提供了在使用 ref 时自定义暴露给父组件的实例值. 在大多数情况下, 应当避免使用 ref 这样的命令式代码. `useImperativeHandle` 应当与 `forwardRef` 一起使用.

```javascript
function FancyInput(props, ref) {
    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus();
        }
    }));
	return <input ref={inputRef} />;
}
FancyInput = forwardRef(FancyInput);

// 渲染 <FancyInput ref={inputRef} /> 的父组件可以调用 inputRef.current.focus()
```

### 2-6 useLayoutEffect

其函数签名与 `useEffect` 相同, 但它会在所有的 DOM 变更之后同步调用 effect. 可以使用它来读取 DOM 布局并同步触发重渲染. 在浏览器执行绘制之前, useLayoutEffect 内部的更新计划将被同步刷新.

应该尽可能的使用标准的 `useEffect` 以避免阻塞视觉更新.

### 2-7 useDebugValue

```javascript
useDebugValue(value)
```

useDebugValue 可用于在 React 开发者工具中显示自定义 hook 标签.

#### 延迟格式化 debug 值

在某些情况下, 格式化值的显示可能是一项开销很大的操作. 除非需要检查 Hook, 否则没有必要这么做. 因此, useDebugValue 接受一个格式化函数作为可选的第二个参数. 该函数只有在 Hook 被检查时才会被调用. 它接受 debug 值作为参数, 并且会返回一个格式化的显示值.

```javascript
useDebugValue(data, data => data.toDateString());
```

# 8. Hooks FAQ

## 1. 采纳策略

### 1-1 哪个版本的 React 包含了 Hook?

从 16.8.9 开始, React 在以下模块中包含了 React Hook 的稳定实现:

- React DOM
- React Native
- React DOM Server
- React Test Renderer
- React Shallow Renderer

要使用 Hook, **所有 React 相关的 package 都必须**升级到 16.8.0 或者更高版本.

React Native 0.59 及以上版本支持 Hook.

### 1-2 我需要重写所有的 class 组件吗?

React 没有计划从 React 中移除 class. 但新代码推荐尝试 Hook.

### 1-3 我的 React 知识还有多少是仍然有用的?

Hook 是使用你已经知道的 React 特性的一种更直接的方式, 比如 state, 生命周期, context, 以及 refs 等. 它并没有从根本上改变 React 的工作方式. 你对组件, props, 以及自顶向下的数据流的知识并没有改变.

### 1-4 我应该使用 Hook, class, 还是两者混用?

不推荐用 Hook 重写已有的 class, 但如果本身为了修复 bug 等原因就打算重写了, 可以使用 Hook.

不能在 class 组件内部使用 Hook, 但可以在组件树中混合使用 class 组件和使用了 Hook 的函数组件. 无论组件是 class 还是一个使用了 Hook 的函数, 都只是这个组件的实现细节而已.

### 1-4 Hook 能否覆盖 class 的所有使用场景?

Hook 的目标是尽早覆盖 class 的所有使用场景. 目前暂时还没有对应不常用的 getSnapshotBeforeUpdate, getDerivedStateFromError 和 componentDidCatch 生命周期的 Hook 等价写法.

目前 Hook 还处于早期阶段, 一些第三方库可能还暂时无法兼容 Hook.

### 1-5 Hook 会替代 render props 和高阶组件吗?

在大部分场景下, Hook 够用了, 并且能够帮助减少嵌套. 但像虚拟滚动条组件或者仍然会有一个 renderItem 属性, 或者一个可见的容器组件或许会有它自己的 DOM 结构. 此时, 这两种模式仍有用武之地.

### 1-6 Hook 对于 Redux connect() 和 React Router 等流行的 API 来说, 意味着什么?

你可以继续使用之前使用的 API, 它们仍会继续有效.

React Redux 从 v7.1.0 开始支持 Hook API, 并暴露了 useDispatch 和 useSelector 等 hook.

React Router 从 v5.1 开始支持 hook.

### 1-7 Hook 能和静态类型一起用吗?

Hook 在设计阶段就考虑了静态类型的问题. 因为它们是函数, 所以它们比高阶组件这样的模式更易于设定正确的类型. 最新版的 Flow 和 TypeScript React 定义已经包含了对 React Hook 的支持.

### 1-8 如何测试使用了 Hook 的组件?

在 React 看来, 一个使用了 Hook 的组件只不过是一个常规组件. 如果你的测试方案不依赖于 React 的内部实现, 测试带 Hook 的组件应该和你通常测试组件的方式没什么差别.

可以使用 React DOM 来测试它. 为了确保它表现得和在浏览器中一样, React DOM 将代码渲染的部分包裹起来, 并更新为 ReactTestUtils.act() 调用.

[代码 8-example.test](src/8-example.test.js)

对 act() 的调用也会清空它们内部的 effect.

> 为了减少不必要的模板项目, 推荐使用 [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), 该项目旨在鼓励你按照终端用户使用组件的方式来编写测试.

### 1-9 lint 规则具体强制了哪些内容?

- 假设任何以 use 开关并紧跟着一个大写字母的函数就是一个 Hook.
- 对 Hook 的调用要么在一个大驼峰法命名的函数 (视作一个组件) 内部, 要么在另一个 useSomething 函数 (视作一个自定义 Hook ) 中.
- Hook 在每次渲染时都按照相同的顺序被调用.

## 2. 从 Class 迁移到 Hook

### 2-1 生命周期方法要如何对应到 Hook ?

- constructor: 函数组件不需要构造函数. 你可以通过调用 useState 来初始化 state. 如果计算的代价比较昂贵, 你可以传一个函数给 useState.
- getDerivedStateFromProps: 改为在渲染时安排一次更新.
- shouldComponentUpdate: 详见下方的 React.memo.
- render: 这是函数组件本身.
- componentDidMount, componentDidUpdate, componentWillUnmount: useEffect Hook 可以表达所有这些(包括不那么常见的场景, 使用依赖项数组实现)的组合.
- getSnapshotBeforeUpdate, componentDidCatch 以及 getDerivedStateFromError: 目前还没有这些方法的 Hook 等价写法, 但很快会被添加.

### 2-2 我该如何使用 Hook 进行数据获取?

基本思路:

```javascript
function SearchResults() {
    const [data, setData] = useState({});
    const [query, setQuery] = useState('query');
    
    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            const result = await axios('http://website/?'+query);
            if(!ignore) setData(result.data);
        }
        fetchData();
        return () => { ignore = true; }
    }, [query]);
    
    return (...)
}
```

### 2-3 有类似实例变量的东西吗?

`useRef()` Hook 不仅可以用于 DOM refs. `ref` 对象是一个 current 属性可变且可以容纳任意值的通用容器.

你可以在 `useEffect` 内部对其进行写入.

```javascript
function Timer() {
    const intervalRef = useRef();
    
    useEffect(() => {
        const id = setInterval(() => {
            // ...
        });
        intervalRef.current = id;
        return () => {
            clearInterval(intervalRef.current);
        }
    });
    
    // ...
    
    function handleCancelClick() {
        clearInterval(intervalRef.current);
    }
    
    return (...)
}
```

从概念上讲, 你可以认为 refs 就像是一个 class 的实例变量. 除非你正在做懒加载, 否则避免在渲染期间设置 refs, 这可能会导致意外的行为. 相反的, 通常你应该在事件处理器和 effects 中修改 refs.

### 2-4 我应该使用单个还是多个 state 变量?

如果你之前用过 class, 或者会试图总是在一次 useState() 调用中传入一个包含了所有 state 的对象.

```javascript
function Box() {
    const [state, setState] = useState({left:0, top:0, width:100, height: 100});
    
    useEffect(() => {
        function handleWindowMouseMove(e) {
            setState(state => ({...state, left: e.pageX, tip: e.pageY}));
            window.addEventListener('mousemove', handleWindowMouseMove);
            return () => window.removeEventListener('mousemove', handleWindowMouseMove);
        }
    }, []);
}
```

因为更新 state 变量, 是直接替换它的值, 这和 class 中的 this.setState 是不一样的行为, 后者会把更新后的字段合并入对象中.

你可以写一个自定义的 useLegacyState Hook 来合并对象 state 的更新. 然而, 还是**推荐把 state 切分成多个 state 变量, 每个变量包含的不同值会在同时发生变化.**

把独立的 state 变量拆分开还有另外的好处. 这使得后期把一些相关的逻辑抽取到一个自定义 Hook 时变得容易.

### 2-5 我可以只在更新时运行 effect 吗?

这是个比较罕见的使用场景. 如果你需要的话, 你可以使用一个可变的 ref 手动存储一个布尔值来表示是首次渲染还是后续渲染, 然后在你的 effect 中检查这个标识.

### 2-6 如何获取上一轮的 props 或 state ?

目前可以通过 ref 来手动实现.

```javascript
function Counter() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();
    useEffect(() => {
        prevCountRef.current = count;
    });
    const prevCount = prevCountRef.current;
    
    return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

可以把它抽取成一个自定义 Hook.

```javascript
function usePrevious(value) {
    const ref = useRef();
    useEffect(() => { ref.current = value; });
    return ref.current;
}
```

### 2-7 为什么我会在我的函数中看到陈旧的 props 和 state ?

#### 情况一: 异步方法

组件内部的任何函数, 包括事件处理函数和 effect, 都是从它被创建的那次渲染中被看到的.

例如:

```javascript
function Example() {
    const [count, setCount] = useState(0);
    function handleAlertClick() {
        setTimeout(() => {
            alert('You clicked on: ' + count);
        }, 3000);
    }
    return (
    	<div>
        	<p>You clicked {count} times</p>
			<button onClick={() => setCount(count+1)}>Click me</button>
			<button onClick={handleAlertClick}>Show alert</button>
        </div>
    );
}
```

如果先点击「Show alert」然后在 3 秒内增加了计数器的计数, 那这个 alert 显示的还是在你点击了「Show alert」按钮时的 count 值.

如果你刻意地想要从某些异步回调中读取最新的 state, 你可以用一个 ref 保存, 修改并读取.

[代码 8-2.7](src/8-2.7.js)

#### 情况二: 依赖数组不正确

如果使用了依赖数组, 但没有正确的指定所有的依赖, 也会造成看到陈旧的 props 和 state. 比如, 如果一个 effect 指定了 [] 作为第二个参数, 但在其内部读取了 someProp, 那么它会一直看到 someProp 的初始值. 解决办法是要么移值依赖数组, 要么**修正**它.(特别注意如何处理函数, 可以参考后面的内容)

> 注意: React 提供了一个 [exhaustive-deps](https://github.com/facebook/react/issues/14920) ESLint 规则作为 [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 包的一部分.

### 2-8 我该如何实现 getDerivedStateFromProps ?

尽管你可能不需要它, 但在一些罕见的你需要用到的场景下, 你可以在渲染过程中更新 state. React 会立即退出第一次渲染并用更新后的 state 重新运行组件以避免耗费太多性能.

```javascript
function ScrollView({row}) {
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [prevRow, setPrevRow] = useState(null);
    if(row !== prevRow) {
        setIsScrollingDown(prevRow !== null && row > prevRow);
        setPrevRow(row);
    }
    return `Scrolling down: ${isScrollingDown}`;
}
```

渲染期间的一次更新恰恰就是 `getDerivedStateFromProps` 一直以来的概念.

### 2-9 有类似 forceUpdate 的东西吗?

如果前后再次的值相同, `useState` 和 `useReducer` Hook 都会放弃更新, 所以也就不会引起重新渲染.

通常情况这样做才是正确的, 但如果真的要强制触发渲染, 可以使用一个增长的计数器来实现.

```javascript
const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
function handleClick() {
    forceUpdate();
}
```

尽量避免这种模式.

### 2-10 我可以引用一个函数组件吗?

尽管不应该经常需要这么做, 但可以通过 `useImperativeHandle`Hook 暴露一些命令式的方法给父组件.

### 2-11 我该如何测量 DOM 节点?

获取 DOM 节点的位置或是大小的基本方式是使用 callback ref. 每当 ref 被附加到一个节点, React 就会调用 callback.

```javascript
function MeasureExample() {
    const [height, setHeight] = useState(0);
    const measuredRef = useCallback(node => {
        if(node !== null) {
            setHeight(node.getBoundingClientRect().height);
        }
    }, []);
    return (
    	<>
        	<h1 ref={measuredRef}>Hello, world</h1>
			<h2>The above header is {Math.round(height)}px tall</h2>
        </>
    );
}
```

这里没有选择使用 useRef, 因为当 ref 是一个对象时它并不会把当前的 ref 的值的变化通知到我们. 使用 callback ref 可以确保子组件延迟显示后(比如响应一次点击), 父组件也能够接收到相关信息.

可以将这个逻辑单独抽取成一个可复用的 Hook.

```javascript
function MeasureExample() {
    const [rect, ref] = useClientRect();
    return (
    	<>
        	<h1 ref={ref}>Hello, world</h1>
			{
                rect !== null &&
                    <h2>The above header is {Math.round(rect.height)}px tall</h2>
            }
        </>
    );
}

function useClientRect() {
    const [rect, setRect] = useState(null);
    const ref = useCallback(node => {
        if(node !== null) {
            setRect(node.getBoundingClientRect());
        }
    }, []);
    return [rect, ref];
}
```

## 3. 性能优化

### 3-1 我可以在更新时跳过 effect 吗?

可以的. 参考之前的 <u>effect 的条件执行</u>.

### 3-2 在依赖列表中省略函数是否安全?

一般来说, 不安全.

```javascript
function Example({someProp}) {
    function doSomething() {
        console.log(someProp);
    }
    useEffect(() => {
        doSomething();
    }, []); // 不安全, 调用的 doSomething 函数中使用了 someProp
}
```

#### 将函数移动到 effect 内部

要记住 effect 外部的函数使用了哪些 props 和 state 很难. 这也是为什么**通常你应该在 effect 内部去声明它所需要的函数**. 这样就能容易的看出 effect 依赖了组件作用域中的哪些值.

```javascript
function Example({someProp}) {
    function doSomething() {
        console.log(someProp);
    }
    useEffect(() => {
        doSomething();
    }, [someProp]); // 安全, effect 仅用到了 someProp
}
```

```javascript
function ProductPage({productId}) {
    const [product, setProduct] = setState(null);
    async function fetchProduct() {
        const response = await fetch('http://api/' + productId); // 使用了 productId prop
        const json = await response.json();
        setProduct(json);
    }
    useEffect(() => {
        fetchProduct();
    }, []); // 这样会出现问题, 因为 fetchProduct 使用了 productId
    // ...
}
// 推荐的修复方案是把 fetchProduct 移动到 effect 内部. 这样就能很容易的看出来 effect 使用了哪些 props 和 state.

// 修复方案:
function ProductPage({productId}) {
    const [product, setProduct] = useState(null);
    useEffect(() => {
        async function fetchProduct() {
            const response = await fetch('http://api/' + productId); // 使用了 productId prop
            const json = await response.json();
            setProduct(json);
        }
        fetchProduct();
    }, [productId]); // 正确, effect 只用到了 productId
    // ...
}

// 可以通过 effect 的内部局部变量来处理无效的响应.
useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
        const response = await fetch('http://api/' + productId);
        const json = await response.json();
        if (!ignore) setProduct(json);
    }
    fetchProduct();
    return () => { ignore = true; };
}, [productId]);
```

#### 由于某些原因无法把函数移动到 effect 内部

- 可以尝试把那个函数移动到组件之外. 这样一来, 这个函数就肯定不会依赖任何 props 或 state.
- 如果调用的方法是一个纯计算, 并且可以在渲染时调用, 可以在 effect 之外调用它, 并让 effect 依赖于它的返回值.
- 万不得已的情况下, 可以把函数加入 effect 的依赖但把它的定义包裹进 useCallback Hook. 这就确保了它不随渲染而改变, 除非它自身的依赖发生了改变.

```javascript
function ProductPage({productId}) {
    const fetchProduct = useCallback(() => {
        // ...
    }, [productId]); // useCallback 的所有依赖已经被指定了
    
    return <ProductDetail fetchProduct={fetchProduct} />;
}

function ProductDetail({fetchProduct}) {
    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]); // 需要将 fetchProduct 函数出现在依赖列表中, 这样就确保了 ProductPage 的 productId prop 的变化会自动触发 productDetails 的重新获取.
}
```

### 3-3 如果我的 effect 的依赖频繁变化, 我该怎么办?

```javascript
function Counter() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setCount(count + 1); // 这个 effect 依赖于 count state
        }, 1000);
        return () => clearInterval(id);
    }, []); // Bug: effect 内部是依赖 count 的
    return <h1>{count}</h1>;
}
```

传入空的依赖数组 [] , 意味着该 hook 只在组件挂载时运行一次, 并非重新渲染. 但如此会有问题, setInterval 传入的回调中, count 的值不会发生变化. 因为当 effect 执行时, 会创建一个闭包, 并将 count 的值保存在该闭包当中, 且值永远为初始值 0. 每隔一秒, 回调就会执行 setCount(0 + 1), 因此, count 永远不会超过 1.

指定 [count] 作为依赖列表就能修复这个 Bug, 但会导致每次改变发生时定时器都被重置. 事实上, 因为每个 setInterval 在被清除前 (类似 setTimeout) 都会被调用一次, 所以表现上看没有问题. 但其实内部造成了太多无意义的 setInterval 和 clearInterval 的调用. 要正确的解决这个问题, 可以使用 setState 的函数式更新形式.

```javascript
function Counter() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => c + 1); // 这里不再依赖外部的 count
        }, 1000);
        return () => clearInterval(id);
    }, []); // effect 不依赖任何变量了
    // setCount 函数是确保稳定的.
    return <h1>{count}</h1>
}
```

此时, setInterval 的回调依旧每秒调用一次, 但每次 setCount 内部的回调取到的 count 将是最新值 (回调中变量名为 c).

在一些更加复杂的场景中, 尝试用 useReducer Hook 把 state 更新逻辑移到 effect 之外. useReducer 的 dispatch 的身份永远是稳定的, 即使 reducer 函数是定义在组件内部并且依赖 props.

万不得已的情况下, 如果想要类似 class 中的 this 功能, 可以使用一个 ref 来保存一个可变的变量, 然后对它进行读写.

```javascript
function Example(props) {
    const latestProps = useRef(props);
    useEffect(() => {
        latestProps.current = props;
    });
    useEffect(() => {
        function tick() {
            console.log(latestProps.current); // 任何时候读取到的都是最新的 props
        }
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);
    //...
}
```

### 3-4  我该如何实现 shouldComponentUpdate ?

可以用 React.memo 包裹一个组件来对它的 props 进行浅比较.

```javascript
const Button = React.memo(props => {
    // 组件
});
```

这不是一个 Hook 因为它的写法和 Hook 不同. React.memo 等效于 PureComponent, 但它只比较 props. 也可以通过第二个参数指定一个自定义的比较函数来比较新旧 props. 如果函数返回 true, 就会跳过更新.

React.memo 不比较 state, 因为没有单一的 state 对象可供比较. 但你可以让子节点变为纯组件, 或者用 useMemo 优化每一个具体的子节点.

### 3-5 如何记忆计算结果?

useMemo Hook 允许你通过记住上一次计算结果的方式在多次渲染之间缓存计算结果.

**再次强调, useMemo 是一种性能优化的手段, 但不要把它当做一种语义上的保证.**

```javascript
function Parent({ a, b }) {
    // 仅当 a 发生改变时重新渲染 Child1
    const child1 = useMemo(() => <Child1 a={a} />, [a]);
	// 仅当 b 发生改变时重新渲染 Child2
	const child2 = useMemo(() => <Child2 b={b} />, [b]);
	return (
    	<>
        	{child1}
        	{child2}
        </>
    );
}
```

注意这种方式在循环中是无效的, 因为 Hook 调用**不能**放在循环中. 但你可以将列表项抽取成一个单独的组件, 并对其调用 useMemo.

### 3-6 如何惰性创建昂贵的对象?

如果依赖数组的值相同, useMemo 可以记住一次昂贵的计算. 但是, 它并**不能保证**计算不会重新运行. 但有时候需要确保一个对象仅被创建一次.

#### 创建初始 state 很昂贵时:

```javascript
function Table(props) {
    // createRows 每次渲染时都会被调用
    const [rows, setRows] = useState(createRows(props.count));
}
```

为了避免这个问题, 可以传一个函数给 useState

```javascript
function Table(props) {
    // createRows 只会在首次渲染时调用
    const [rows, setRows] = useState(() => createRows(props.count));
}
```

#### 想要避免重新创建 useRef() 的初始值时:

```javascript
function Image(props) {
    // IntersectionObserver 在每次渲染时都会被创建
    const ref = useRef(new IntersectionObserver(onIntersect));
}
```

useRef **不会**像 useState 那样接受一个特殊的函数重载. 你需要编写自己的函数来创建并将其设为惰性.

```javascript
function Image(props) {
    const ref = useRef(null);
    function getObserver() {
        if(ref.current === null) {
            ref.current = new IntersectionObserver(onIntersect);
        }
        return ref.current;
    }
    // 在需要时调用 getObserver()
}
```

### 3-7 Hook 会因为在渲染时创建函数而变慢吗?

不会. 在现代浏览器中, 闭包和类的原始性能只有在极端场景下才会有明显的差别.

除此之外, 可以认为 Hook 的设计在某些方面更加高效:

- Hook 避免了 class 需要的额外开支, 像是创建类实例和在构造函数中绑定事件处理器的成本.
- 符合语言习惯的代码在使用 Hook 时不需要很深的组件树嵌套. 这个现象在使用高阶组件, render props, 和 context 的代码库中非常普遍. 组件树越小, React 的工作量也随之减少.

传统上认为, 在 React 中使用内联函数对性能的影响, 与每次渲染都传递新的回调会破坏子组件的 `shouldComponentUpdate` 优化有关. Hook 从三个方面解决了这个问题:

- useCallback Hook 允许你在重新渲染之间保持对应相同的回调引用以使得 shouldComponentUpdate 继续工作: `const memoizedCallback = useCallback(() => {}, [a,b])` 除非 'a' 或 'b' 改变, 否则不会变.
- useMemo Hook 使得控制具体子节点何时更新变得更容易, 减少了对纯组件的需要.
- 最后, useReducer Hook 减少了对深层传递回调的依赖.

### 3-8 如何避免向下传递回调?

大部分人并不喜欢在组件树的每一层手动传递回调, 尽管这种写法更明确, 但会让人感觉复杂与麻烦.

在大型的组件树中, 推荐的替代方案是通过 context 用 useReducer 往下传一个 dispatch 函数.

```javascript
const TodosDispatch = React.createContext(null);

function TodosApp() {
    const [todos, dispatch] = useReducer(todosReducer);
    return (
    	<TodosDispatch.Provider value={dispatch}>
        	<DeepTree todos={todos} />
        </TodosDispatch.Provider>
    );
}

// TodosApp 内部组件树里面的任何子节点都可以使用 dispatch 函数向上传递 actions 到 TodosApp

function DeepChild(props) {
    const dispatch = useContext(TodosDispatch);
    function handleClick() {
        dispatch({ type: 'add', text: 'hello' });
    }
    return <button onClick={handleClick}>Add todo</button>;
}
```

从维护的角度来看, 这样更加方便(不用不断转发回调), 同时也避免了回调的其他问题. 像这样向下传递 dispatch 是处理深度更新的推荐模式.

### 3-9 如何从 useCallback 读取一个经常变化的值?

推荐使用上一节的 <u>context 向下传递 dispatch</u> 而非在 props 中使用独立的回调.

在某些罕见场景中, 你可能会需要用 useCallback 记住一个回调, 但由于内部函数必须经常重新创建, 记忆效果不是很好. 如果要记住的函数是一个事件处理器并且在渲染期间没有被用到, 可以把 ref 当做实例变量来用, 并手动把最后提交的值保存其中.

```javascript
function Form() {
    const [text, updateText] = useState('');
    const textRef = useRef();
    useEffect(() => { textRef.current = text; }); // 每次 text 变动都写入 ref
    const handleSubmit = useCallback(() => {
        const currentText = textRef.current; // 从 ref 中读取
        alert(currentText);
    }, [textRef]); // 不用像 text 那样频繁创建 handleSubmit
    return (
    	<>
        	<input value={text} onChange={e => updateText(e.target.value)} />
			<ExpensiveTree onSubmit={handleSubmit} />
        </>
    );
}
```

这是一个比较麻烦的模式, 但如果真要以这种方式优化. 可以把这个功能单独抽取成一个自定义 Hook.

```javascript
function Form() {
    const [text, updateText] = useState('');
    const handleSubmit = useEventCallback(() => {
        alert(text);
    }, [text]);
    
    return (
    	<>
        	<input value={text} onChange={e => updateText(e.target.value)} />
			<ExpensiveTree onSubmit={handleSubmit} />
        </>
    );
}

function useEventCallback(fn, dependencies) {
    const ref = useRef(() => {
        throw new Error('');
    });
    useEffect(() => {
        ref.current = fn;
    }, [fn, ...dependencies]);
    return useCallback(() => {
        const fn = ref.current;
        return fn();
    }, [ref]);
}
```

## 4. 底层原理

### 4-1 React 是如何把对 Hook 的调用和组件联系起来的?

React 会保持对当前渲染中的组件的追踪, 多亏了 Hook 规范, 保证 Hook 只会在 React 组件中被调用.

每个组件内部都有一个「记忆单元格」列表. 它们被用来存储一些数据的 JavaScript 对象. 当你用 useState() 调用一个 Hook 时, 它会读取当前的单元格 (或在首次渲染时将其初始化), 然后将指针移动到下一个. 这就是多个 useState() 调用会得到各自独立的本地 state 的原因.

### 4-2 Hook 使用了哪些现有技术?

Hook 由不同的来源的多个想法构成:

- [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) 这个仓库中包含了对函数式 API 的老旧实验.
- React 社区对 render prop API 的实验, 其中包含 [Ryan Florence](https://github.com/ryanflorence) 的 [Reactions Component](https://github.com/reactions/component).
- [Dominic Gannaway](https://github.com/trueadm) 的用 [adopt 关键字](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067)作为 render props 的语法糖的提案.
- [DisplayScript](http://displayscript.org/introduction.html) 中的 state 变量和 state 单元格.
- ReasonReact 中的 [Reduer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html).
- Rx 中的 [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html).
- Multicore OCaml 提到的 [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting).

[Sebastian Markbåge](https://github.com/sebmarkbage) 想到了 Hook 最初的设计，后来经过 [Andrew Clark](https://github.com/acdlite)，[Sophie Alpert](https://github.com/sophiebits)，[Dominic Gannaway](https://github.com/trueadm)，和 React 团队的其它成员的提炼。

