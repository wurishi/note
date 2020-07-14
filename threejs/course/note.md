---
typora-root-url: assets
---

[参考链接](http://www.yanhuangxueyuan.com/Three.js_course.html)

# 1. 第一个 three.js 三维场景

## 1.1 第一个3D场景

[代码](1.1.html)

- 几何体 Geometry : `THREE.BoxGeometry(100, 100, 100)` 创建了一个长宽高都是100的立方体.
- 材质 Material : `THREE.MeshLambertMaterial` 用于创建一个可以用于立方体的材质对象, 可以包含颜色, 透明度等属性.
- 光照 Light : `THREE.PointLight` 用于创建一个点光源对象.参数表示RGB对应的光照强度.
- 相机 Camera : `THREE.ORthographicCamera` 创建一个正射投影相机对象.

### 程序结构树状图

![1.1-1](/1.1-1.png)

### 场景 - 相机 - 渲染器

![1.1-2](/1.1-2.png)

### 对象, 方法和属性

![1.1-3](/1.1-3.png)

### WebGL 封装

![1.1-4](/1.1-4.png)

## 1.2 插入新的几何体

[代码](1.2.html)

- SphereGeometry(radius, widthSegments, heightSegments) : 创建一个球体

  | 参数           | 含义     |
  | -------------- | -------- |
  | radius         | 球体半径 |
  | widthSegments  | 球面精度 |
  | heightSegments | 球面精度 |

## 1.3 设置透明度和高光

[代码](1.3.html)

### 设置透明度

更改材质对象参数中的 opacity 和 transparent 属性实现透明度.

opacity : 表示透明, 值的范围是0~1.

transparent : 表示是否开启透明度效果, 默认是 false 表示透明度设置不起作用.

### 添加高光

MeshLambertMaterial() 实现的是漫反射渲染, 高光效果要通过 MeshPhongMaterial() 模拟镜面反射实现. 

specular : 表示高光颜色, 高光颜色的 RGB 值会与光照颜色的 RGB 分量相乘. 

shininess : 可以理解为光照强度的系数.

## 1.4 添加旋转动画

[代码](1.4.html)

## 1.5 鼠标操作三维场景

[代码](1.5.html)

- THREE.OrbitControls(camera, renderer.domElement) : 创建操作控件, 注意第二个参数.
- controls.addEventListener('change', render) : 监听到 change 事件后触发渲染, 但一般都会有 requestAnimationFrame 循环调用, 所以一般不用特意注册事件.