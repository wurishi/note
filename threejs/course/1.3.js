// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建网格模型
const box = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体几何对象
const material = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // 材质对象
const mesh = new THREE.Mesh(box, material); // 网格模型对象
scene.add(mesh); // 将网格模型添加到场景中

const sphere = new THREE.SphereGeometry(60, 40, 40);// 创建一个球体几何对象
// const sphereMaterial = new THREE.MeshLambertMaterial({
//     color: 0xff0000,
//     opacity: 0.7, // 透明度
//     transparent: true, // 是否开启透明效果
// }); // 漫反射材质对象
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    specular: 0x4488ee,
    shininess: 12,
});
const sphereMesh = new THREE.Mesh(sphere, sphereMaterial); // 网格模型对象
scene.add(sphereMesh); // 添加到场景中

sphereMesh.translateY(100); // 球体网格模型沿Y轴正方向平移100

// 光源设置
const point = new THREE.PointLight(0xffffff);// 点光源
point.position.set(400, 200, 300); // 点光源位置
scene.add(point); // 点光源添加到场景中

const ambient = new THREE.AmbientLight(0x444444); // 环境光
scene.add(ambient);

// 相机设置
const width = window.innerWidth;
const height = window.innerHeight;
const k = width / height; // 窗口宽高比
const s = 100; // 三维场景缩放系数
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000); // 创建相机对象
camera.position.set(200, 300, 200); // 设置相机位置
camera.lookAt(scene.position); // 设置相机方向(指向场景)

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xb9d3ff, 1); // 背景颜色
document.body.appendChild(renderer.domElement); // 往body插入canvas对象
// 执行渲染
renderer.render(scene, camera);