# 创建一个场景

[参考](http://www.webgl3d.cn/threejs/docs/index.html#manual/zh/introduction/Creating-a-scene)

[代码](1.html)

- requestAnimationFrame : 比起 setInterval 而言, requestAnimationFrame 最大的优点就是切换到其它标签页时, 它会暂停. 即不会在后台消费资源.

# 画线

[参考](http://www.webgl3d.cn/threejs/docs/index.html#manual/zh/introduction/Drawing-lines)

[代码](public/drawing-lines.html)

- BufferGeometry : 比起 Geometry 会有更好的性能.

# 创建文字

## 1. DOM + CSS

使用 div + 绝对定位来显示文本

## 2. 将文字绘制到画布中, 并将其作为 Texture

## 3. 在 3D 软件里创建模型, 并导入

## 4. 使用 three.js 自带的文字几何体

```javascript
new THREE.TextGeometry
```

## 5. 位图字体