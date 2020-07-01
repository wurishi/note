---
typora-root-url: assets
---

![webgl25a](/webgl25a.png)

[参考链接](http://www.yanhuangxueyuan.com/WebGL_course.html)

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

## 3. WebGL 坐标系(投影)

[代码](3.html)

### gl.vertexAttribPointer(index, size, type, normalized, stride, offset)

size: 拿几个数据放到 attribute 里, 如果 attribute 类型是 vec4, 但指定的数据不够4个, 也会自动补全.

## 4. WebGL 平移变换

### 要求: 沿X轴平移-0.4

```javascript
const data = new Float32Array([
    0.0, 0.0, 1.0,
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0
]);
```

### 方法一

```javascript
// 将三个顶点的x坐标分别减0.4
const data = new Float32Array([
    -0.4, 0.0, 1.0,
    -0.4, 1.0, 0.0,
     0.6, 0.0, 0.0,
]);
```

### 方法二

```javascript
for(let i = 0; i < 9; i+=3) {
    data[i] += -0.4;
}
```

### 方法三

```
// 在顶点着色器中计算
gl_Position = vec4(apos.x - 0.4, apos.y, apos.z, 1);
```

### 方法四

```javascript
// 创建平移矩阵
// 1	0	0	-0.4
// 0	1	0	0
// 0	0	1	0
// 0	0	0	1
mat4 m4 = mat4(1,0,0,0, 0,1,0,0, 0,0,1,0, -0.4,0,0,1);
gl_Position = m4 * apos;

/*
┌ 1 0 0 Tx ┐   ┌ x ┐   ┌ x+Tx ┐
│ 0 1 0 Ty │ * │ y │ = │ y+Ty │
│ 0 0 1 Tz │   │ z │   │ z+Tz │
└ 0 0 0 1  ┙   └ 1 ┙   └  1   ┙
*/
```

## 5. WebGL 绘制立方体

[代码](5.html)

### 着色器内置函数

- radians() : 角度值转化为弧度值, 参数是浮点数float, 所以45必须写成45.0.
- cos, sin : 余弦, 正弦函数, 参数要求为弧度值且是浮点数.

## 6. WebGL 顶点索引绘制

在上一节的绘制立方体时, 虽然立方体本身只需要8个顶点, 但因为使用 drawArrays() 方法的线模式(gl.LINES), 所以绘制直线至少需要两个顶点, 使得顶点在数组中多次出现, 造成数据重复.

要解决数据重复, 可以将立方体的8个顶点声明在一个数组中, 再声明一个索引数组并多次指向这8个顶点. **(多数更复杂的三维模型都会建立顶点索引来复用顶点数据)**

WebGL 为了复用顶点数据引了一个绘制方法 drawElements(), 它和 drawArrays() 的功能类似, 主要区别就是 drawArray() 方法调用的是顶点数组数据, 而 drawElements() 是通过一个索引数组访问顶点数据的.

## 7. varying 变量和颜色插值

之前一系列顶点通过顶点着色器逐顶点处理后, 再经过图元装配, 光栅化环节后会得到原始未定义颜色的片元. 然后经过片元着色器逐片元添加颜色后, 得到一副图像.

在片元着色器程序中编写代码 `gl_FragColor = vec4(1.0,0.0,0.0,1.0)` 就表示所有经过光栅化生成的未定义颜色的片元经过片元着色器处理后所有片元赋值红色, 得到一个个红色的像素. 如果希望不同片元定义不同的颜色怎么编写代码? 比如立方体每个面的颜色不同, 更具体点比如代码 `gl.drawElements(gl.TRIANGLES, 0, gl.UNSIGNED_BYTE, 6);` 表示利用6个顶点, 每三个顶点绘制一个三角形面, 如果希望这两个三角面的颜色不同, 该如何实现?

这时就需要学习新的顶点数据, 之前学习了**顶点位置数据**, 现在来讲**顶点颜色数据**, 以及顶点颜色使用关键字 varying 实现颜色插值计算.

[颜色插值](7.html)

- varying : 将二个顶点变量的颜色 a_color 赋值给 varying vec4 v_color 即: v_color = a_color 后, GPU 会自动内插出两个点之间的所有像素, 这个过程即像素的线性插值.

[1. 彩色三角形](7-1.html)

[2. 两个单色三角面](7-2.html)

[3. 颜色插值 (位置,颜色使用一个缓冲区)](7-3.html)

