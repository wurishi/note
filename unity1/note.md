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

