---
typora-root-url: assets
---

![webgl25a](/webgl25a.png)

# 一. WebGL零基础快速入门

## 1. WebGL 绘制一个点

[代码](1.html)

### 创建 Canvas 画布

### Canvas 对象方法 .getContext()

```javascript
canvas.getContext('webgl'); // 返回一个可以使用 WebGL API 的上下文
```

### 着色器语言 GLSL ES

WebGL 的着色器代码由  GLSL ES 来编写, 是直接运行于 GPU 之上的.

与 OpenGL API 相配合的着色器语言是 GLSL.

与 OpenGL ES API 相配合的着色器语言是 GLSL ES.

OpenGL 标准应用的是客户端, OpenGL ES 应用的是移动端, WebGL 标准应用的是浏览器平台.

顶色着色器定义了顶点的渲染位置和点的渲染像素大小.

```html
<script id='vertexShader' type="x-shader/x-vertex">
    void main() {
        // 给内置变量gl_PointSize赋值像素大小
        gl_PointSize = 20.0;
        // 顶点位置, 位于坐标原点
        gl_Position = vec4(0.0,0.0,0.0,1.0);
    }
</script>
```

片元着色器定义了点的渲染结果像素的颜色值.

```html
<script id='fragmentShader' type="x-shader/x-fragment">
    void main() {
        // 定义片元颜色
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
</script>
```

gl_PointSize, gl_Position, gl_FragColor 都是内置变量, 不需要声明即可使用.

### WebGL API

通过 `canvas.getContext('webgl')` 返回的对象有着一系列绘制渲染方法, 这些方法就是 WebGL API.

顶点着色器和片元着色器都需要编译后才能使用.

### 绘制方法

`gl.drawArrays()`的作用就是通知 GPU 执行着色器代码, 然后根据着色器在 Canvas 上进行渲染绘制.

### 着色器代码

着色器代码在 Javascript 中是以字符串形式存在的, 为了编写方便, 可以把着色器代码写在 script 标签中, 然后使用元素的 .innerText 获取字符串, 或者使用 ``.

## 2. WebGL 绘制一个矩形

[代码](2.html)

### gl.drawArrays(mode, first, count)

mode: 为绘制模式

first: 从第几个点开始绘制

count: 绘制几个点

### attribute 关键字

声明:

```html
<script id='vertexShader' type="x-shader/x-vertex">
    // 声明 vec4 类型的变量 apos
    attribute vec4 apos;
    void main() {
        // 将顶点坐标apos赋值给内置变量gl_Position
        gl_Position = apos;
    }
</script>
```

在 js 中使用:

```javascript
// 创建缓冲区
const buffer = gl.createBuffer();
// 绑定缓冲区对象, 激活buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
// 将顶点数组data数据传入缓冲区
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
// 将缓冲区中的数据按照一定的规律传递给位置变量apos
gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 0, 0);
// 允许数据传递
gl.enableVertexAttribArray(aposLocation);
```

### drawArray 整体执行顺序

![webgl91](/webgl91.jpg)