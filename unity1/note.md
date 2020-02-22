# Chapter 1: C#与Unity基础

## 1. 游戏物体与脚本

```
1_1_ClockScene:
使用简单的物体建立一个时钟
C#脚本
调整时钟指针显示时间
添加指针的动画效果
```

## 2. 组成图形

```
1_2-3_GraphScene:
创建一个Prefab
生成一条由立方体组成的线
显示数学函数
创建一个自定义shader
让图像动起来
```

### 2.1 什么是"albedo", 什么是"alpha"?

> 一个材质通过漫反射(diffuse reflectivity)而表现出的颜色被称之为 albedo(反射色). Albedo 是一个拉丁文单词, 含义是"白度(whiteness)". 它描述了材质可以漫反射多少红绿蓝三种颜色通道(color channel)的色彩.
>
> Alpha 用来衡量不透明度(opacity). Alpha 值为 0 表示完全透明, 1 表示完全不透明.

## 3. 数学曲面

```
1_2-3_GraphScene:
支持多个函数方法
使用委托和枚举
使用Grid显示2D函数
定义3D空间中的表面
```

## 4. 构造分形

```
1_4_FractalScene:
实例化游戏物体
运用递归
使用协程
加入随机性
```

### 4.1 什么是 Mesh(网格)?

> Mesh是图形硬件绘制复杂图形时要用到的组成结构. 它是3D的, 并且 Unity 提供了默认的 Mesh 图形, 你也可以通过代码生成自己的 Mesh.
>
> 一个 Mesh 至少包含3D空间中的点的集合, 以及一组三角面. 三角面是组成3D的 Mesh 所需的主要2D形状, 三角面通过点的关系来确定. 三角面的数量和状态决定了 Mesh 的表面形状. 通常, 观察3D物体时, 你不会意识到你正在观察的是一个个三角面.

### 4.2 什么是 Material(材质)?

> Material 常常用来定义物体的视觉属性, 它们可以表现的非常简单, 比如说纯色填充; 也可以非常复杂.
>
> Material 由 Shader(着色器)组成. Shader 是用来告诉图形硬件一个物体的轮廓外形要如何绘制的基本脚本.
>
> 标准漫反射(standard diffuse shader)使用单一的颜色并可设置 Texture(纹理贴图). 根据场景中的光照情况来决定一个物体的外观.
>
> 用(specular shader)来模拟高光效果的镜面反射.

### 4.3 Start 方法在什么时候被调用?

> Start方法将在场景中的组件被创建并激活后调用, 并且如果你的代码加入了 Update 方法, Start 会在第一次 Update 方法执行之前执行. Start 方法只会执行一次.

### 4.4 AddComponent 语句都干了什么?

> AddComponent 方法将会创建一个指定类型的组件, 并将它附加到游戏物体上, 同时该方法的返回值返回的是这个组件的数据. 所以之后我们可以立即为它设置一个值. 你也可以使用中间变量来存储返回的组件数据, 然后再给它赋值:

```c#
MeshFilter filter = gameObject.AddComponent<MeshFilter>();
filter.mesh = mesh;
```

### 4.5 Initialize 方法在 Start 方法之前调用?

> 首先新的游戏物体被创建, 然后一个新的 Fractal 组件也随之创建并附加给这个新物体. 这时, 如果存在 Awake 方法和 OnEnable 方法, 将会调用它们, 再然后 AddComponent 方法就执行完毕. 这个时候就会直接执行我们在 AddComponent 方法后写的 Initialize 方法. 而新物体脚本的 Start 方法则会在下一帧才被调用.

### 4.6 枚举器(Enumerator)是什么?

> 枚举(Enumeration), 指的是一次遍历集合所有元素的过程. 比如说, 循环一个数组中的所有元素.
>
> 枚举器(Enumerator), 也叫作迭代器(Iterator), 指提供了枚举功能接口的对象.
>
> System.Collections.Ienumerator 就提供了这样的接口.
>
> 为什么我们需要这样做? 因为协程使用它们.

### 4.7 yield 是什么?

> yield 语句是来告诉程序, 在枚举过程中, 你遍历到了集合中的第几个元素, 或者全部遍历完毕.
>
> 当使用 yield 语句时, 一个迭代器的实例对象就会在后台自动创建, 用于处理对应的枚举过程. 这就是为什么 CreateChildren 方法需要使用 IEnumerator 作为返回类型.

### 4.8 协程是如何工作的?

> 当你在 Unity 中创建一个协程时, 其实就是创建了一个迭代器. 当你把它传递给 StartCoroutine 方法, 它将在每一帧存储和检测下一个枚举内容, 直到整个枚举过程完成.
>
> yield 语句会提供枚举内容.
>
> 你可以通过 yield 语句返回指定内容, 比如我们用到的 WaitForSecond.

### 4.9 Dynamic Batching (动态合批)

通过查看 Unity 中的 Stats 面板, 会发现当场景中物体越来越多时, Batches 会大副增加, FPS 则会降低, 意味着游戏整体运行的性能下降.

此时开启 Dynamic Batching, 会发现 Stats 面板中的 Batches 减少, 而 Saved by batching 会增加, 此时 FPS 会远大于之前, 意味着游戏整体运行的性能也有提升.

什么是动态合批?

> 动态合批(Dynamic batching)是"Unity 绘制调用机制(draw call batching performed by Unity)"的一种形式.
>
> 简单的说, 它将多个使用相同材质的网格(Mesh)组合成一个更大的网格整体, 这样做可以减少 CPU 和 GPU 之间的通信数量, 从而优化性能.
>
> 该机制只是为了小一些的网格而准备的. 比如说, 你会发现它适用于 Unity 内置的 cube 网格, 但是不适用于内置的 sphere 网格.

### 4.10 Lerp 方法做了什么?

> Leap 的含义代表的就是线性插值, 它的典型用法就是 Lerp(a,b,t), 返回值通过 a+(b-a)*t 来计算. t 的取值范围在 0 到 1 之间. 它有多种不同类型参数的方法版本, 比如小数, 向量, 颜色等.