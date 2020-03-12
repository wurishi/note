# 1. ECS Entity Component System 入门学习1

使用的是2015年谷歌(是 Wooga 的) 在 Github 上发布的一个名叫 Entitas 的 ECS 框架.

[Github地址](https://github.com/sschmid/Entitas-CSharp/wiki)

## 1.1 什么是 ECS 框架?

其实 Unity 本身的组件开发就是 ECS 框架. 但是在 Unity 中写脚本, 拖到每一个 GameObject 下, 其实都是一个 MonoBehaviour, 这个脚本中往往既包含了数据, 又包含了方法. 而 Entitas 的目标是让数据和方法分离. 在 GameObject 下只添加数据, 而方法由其他系统完成.

在 Entitas 下, GameObject 的组件不能有任何方法, 只保存数据, 数据代表特性, 拥有一样特性的执行逻辑(也就是方法)会在特定时间点上统一执行.

数据和方法的解耦, 会有以下的好处:

1. 添加的功能可以逐个做单元测试.
2. 代码共享方便.
3. 在 GameObject 下只有数据, 没有任何方法或者说没有逻辑上的代码.
4. 很容易查询到拥有相同类型数据的对象.
5. 效率高.

## 1.2 框架中的四种概念

```
+------------------+
|     Context      |
|------------------|
|    e       e     |      +-----------+
|        e     e---|----> |  Entity   |
|  e        e      |      |-----------|
|     e  e       e |      | Component |
| e            e   |      |           |      +-----------+
|    e     e       |      | Component-|----> | Component |
|  e    e     e    |      |           |      |-----------|
|    e      e    e |      | Component |      |   Data    |
+------------------+      +-----------+      +-----------+
  |
  |
  |     +-------------+  Groups:
  |     |      e      |  Subsets of entities in the context
  |     |   e     e   |  for blazing fast querying
  +---> |        +------------+
        |     e  |    |       |
        |  e     | e  |  e    |
        +--------|----+    e  |
                 |     e      |
                 |  e     e   |
                 +------------+
```

### Entity 实体

Entity 就是一个数据的集合, **只有数据, 没有方法**. 你可以以组件形式 (`IComponent`) 添加, 替代, 删除这些数据, Entity会触发相应的事件以处理数据的变化.

### Context 环境

Context 就是创建销毁 Entity 的工厂, 你可以使用它来过滤出你所感兴趣的 Entity.

### Group 组

组在 Context 中可以进行快速过滤, 它能不间断的更新以保持当前的组中的 Entity 是最新的.

组和组内过滤到的 Entity 会被缓存下来, 所以即使多次调用 `GetGroup` 获取组的方法, 对性能也不会造成多大的影响.

同时组拥有 `OnEntityAdded` , `OnEntityRemove` 和 `OnEntityUpdated` 方法, 来处理拥有相同类型数据 Entity 的行为.

### Collector 收集器

Collector 提供了一种简单的方法来处理 Group 中 Entity 变化的反应. 与组中直接添加方法的区别是, 它能汇总处理 Entity, 并且很方便的实现特定情况下的处理方式.

## 1.3 举个栗子

1. 首先在 Assets 目录下创建一个新目录, 并将 Entitas.zip 解压到目录下.

2. 打开 Tools > Jenny > Preferences 打开窗口, 选择 Auto Import 后, 点击 Generate 生成一些默认脚本. 主要是自动生成了 Contexts Feature 代码文件, 和对应的 Contexts 的一些代码. (默认有 Game 和 Input)

3. 创建一个 Component

   ```c#
   using Entitas; // Entitas的命名空间
   
   [Game] // 标签是必须的, 不然没法通过 context 找到这个 component
   // 不写的话默认会被添加进 Game 的 context
   
   // 继承于 IComponent
   public class DebugMessageComponent : IComponent {
       public string message; // 属性数据
   }
   ```

   创建完后要重新生成一下代码 (快捷键 Ctrl + Shift + G).

4. 编写处理 Component 的方法