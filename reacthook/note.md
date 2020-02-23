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

在函数组件中, 我们没有 `this` , 所以我们不能分配或读取 `this.state` . 我们直接在组件中调用 `useState` Hook:

```javascript
import React, { useState } from 'react';
function Example() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
}
```

### 4-1 调用 `useState` 方法的时候做了什么?

它定义了一个 "state 变量". 我们把这个变量叫做 `count`, 当然我们也可以叫他任何名字. 这是一种在函数调用时保存变量的方式 -- `useState` 是一种新方法, 它与 class 里面的 `this.state` 提供的功能完全相同. 一般来说, 在函数退出后变量就会"消失", 但在 state 中的变量会被 React 保留.

### 4-2 useState 需要哪些参数?

`useState()` 方法里面唯一的参数就是初始 state. 不同于 class 的是, 我们可以按照需要使用的是数字或字符串对其进行赋值, 而不一定是对象.

### 4-3 useState 方法的返回值是什么?

返回值为: 当前 state 以及更新 state 的函数. 就像之前代码中写的 `const [count, setCount] = useState()`, 这与 class 里面的 `this.state.count` 和 `this.setState` 类似, 唯一区别就是你需要**成对**的获取它们.

> 注意: 
>
> 你可能想知道: 为什么叫 useState 而不叫 createState ?
>
> "Create" 可能不是很准确, 因为 state 只在组件首次渲染的时候被创建. 在下一次重新渲染时, useState 会返回当前的 state. 否则它就不是 "state" 了! 这也是 Hook 的名字总是以 use 开头的一个原因.

## 5. 读取 state

当我们想在 class 中显示当前的 count, 我们读取 `this.state.count`:

```
<p>You Clicked {this.state.count} times</p>
```

在函数中, 我们可以直接用 `count`:

```
<p>You clicked {count} times</p>
```

## 6. 更新 state

在 class 中, 我们需要调用 `this.setState()`来更新 `count`值:

```
<button onClick = {() => this.setState({ count: this.state.count + 1 })}>
Click me
</button>
```

在函数中, 我们已经有了 `setCount`和 `count`变量, 所以我们不需要 `this`:

```
<button onClick = {() => setCount(count + 1)}>
Click me
</button>
```

## 7. 提示:  方括号有什么用?

你可能注意到我们用方括号定义了一个 state 变量

```
const [count, setCount] = useState(0);
```

等号左边名字并不是 React API 的部分, 你可以自己取名字.

这里的 [] 其实是 JavaScript 语法叫**数组解构**. 这意味着我们同时创建了 `count`和 `setCount`两个变量, `count`的值为 `useState`返回的第一个值, `setCount`是返回的第二个值. 它等价于下面的代码:

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
    
    // 这个组件中有局部变量 age, fruit, todos, 我们可以只单独更新其中的一个:
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

有时候, 我们只想**在 React 更新 DOM 之后运行一些额外的代码**. 比如发送网络请求, 手动更改 DOM, 记录日志等. 这些都是常见的无需清除的操作. 因为在执行完这些操作之后, 就可以忽略他们了. 让我们对比一下使用 class 和 Hook 都是怎么实现这些副作用的.

### 1-1 使用 Class 的示例

在 React 的 class 组件中,  `render` 函数是不应该有任何副作用的. 一般来说, 在这里执行操作太早了, 我们基本上都希望在 React 更新 DOM 之后才执行我们的操作.

这就是为什么在 React class 中, 我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中.

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

**注意, 在这个 class 中, 我们需要在两个生命周期函数中编写重复的代码.**

这是因为很多情况下, 我们希望在组件加载和更新时执行同样的操作. 从概念上说, 我们希望它在每次渲染之后执行, 但 React 的 class 组件没有提供这样的方法. 即使我们提取出一个方法, 我们还是要在两个地方调用它.

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

通过使用 useEffect 这个 Hook, 等于告诉 React 组件需要在渲染后执行某些操作. React 会保存你传递的函数 (我们将它称之为 "effect"), 并且在执行 DOM 更新之后调用它.

#### 1-2-b: 为什么在组件内部调用 useEffect?

将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量 (或其他 props). 我们不需要特殊的 API 来读取它, 它已经保存在函数作用域中. Hook 使用了 JavaScript 的闭包机制, 而不用在 JavaScript 已经提供了解决方案的情况下, 还引入其它特定的 React API.

*就像 React 在 UI 中使用 {if} 来处理逻辑判断语句一样, React 的特点就是尽量使用已有的方案去解决问题, 对比 Vue 的 v:if 这种可以减少学习成本.*

#### 1-2-c: useEffect 会在每次渲染后都执行吗?

默认情况下是的, 它在第一次渲染之后和每次更新之后都会执行. 你可能会更容易接受 effect 发生在"渲染之后"这种概念, 不用再去考虑"挂载"还是"更新". React 保证了每次运行 effect 的同时, DOM 都已经更新完毕.

> 要注意的是, 传递给 `useEffect` 的函数在每次渲染中都会有所不同, 这是刻意为之的. 事实上这正是我们可以在 effect 中获取最新的 `count` 的值, 而不用担心其过期的原因. 每次我们重新渲染, 都会生成新的 effect, 替换掉之前的. 某种意义上讲, effect 更像是渲染结果的一部分, 每个 effect "属于"一次特定的渲染.

> 与 `componentDidMount` 或 `componentDidUpdate` 不同, 使用 `useEffect` 调度的 effect 不会阻塞浏览器更新屏幕, 这让你的应用看起来响应更快. 大多数情况下, effect 不需要同步地执行, 在个别情况下 (例如测量布局), 有单独的 `useLayoutEffect` Hook 供你使用, 其 API 与 `useEffect` 相同.

## 2. 需要清除的 effect

有些副作用是需要清除的, 例如**订阅外部数据源**. 这种情况下, 清除工作是非常重要的, 可以防止引起内存泄漏!

### 1-1 使用 Class 的示例

在 React class 中, 通常会在 `componentDidMount` 中设置订阅, 并在 `componentWillUnmount` 中清除它. 例如, 假设我们有一个 `ChatAPI` 模块, 它允许我们订阅好友的在线状态.

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

你会注意到 `componentDidMount` 和 `componentWillUnmount` 之间相互对应. 使用生命周期函数迫使我们拆分这些逻辑代码, 即使这两部分代码都作用于相同的副作用.

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

Hook 允许我们按照代码的用途分离他们, 而不是像生命周期函数那样.

### 3-2 为什么每次更新的时候都要运行 Effect

在之前的 class 示例的最后已经提到了, 当组件的 friend prop 发生变化时, 我们需要添加 `componentDidUpdate` 来解决仍然展示原来好友状态的 bug.

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

在某些情况下, 每次渲染后都执行清理或者执行 effect 可能会导致性能问题. 在 class 组件中, 我们可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决.

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
> 如果你传入了一个空数组([]), effect 内部的 props 和 state 就会一直拥有其初始值, 尽管这样做更接近大家熟悉的 `componentDidMount` 和 `componentWillUnmount` 思维模式, 但我们有更好的方式来避免过于频繁的重复调用 effect.(参考后续 Hooks FAQ)

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
// 这就是为什么 Hook 需要在我们组件的最顶层调用. 如果想要有条件地执行一个 effect, 可以将判断放到 Hook 的内部
useEffect(() => {
    if(name !== '') {
        localStorage.setItem('formData', name);
    }
});
```

