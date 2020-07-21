// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

const sphere = new THREE.SphereGeometry(50, 20, 20);
const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const mesh = new THREE.Mesh(sphere, material);
scene.add(mesh);

// 光源设置
// 点光源
const point = new THREE.PointLight(0xffffff);// 点光源
point.position.set(400, 200, 300); // 点光源位置
scene.add(point); // 点光源添加到场景中
// 环境光
// const ambient = new THREE.AmbientLight(0xffffff);
// ambient.position.set(400, 200, 300);
// scene.add(ambient);
// 平行光
// const direct = new THREE.DirectionalLight(0xffffff);
// direct.position.set(400, 200, 300);
// scene.add(direct);
// 聚光灯光源
// const spot = new THREE.SpotLight(0xffffff);
// spot.position.set(400, 200, 300);
// scene.add(spot);
// 半球光源
// const hem = new THREE.HemisphereLight(0xff0000);
// hem.position.set(400, 200, 300);
// scene.add(hem);

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

const controls = new THREE.OrbitControls(camera, renderer.domElement); // 创建操作控件
controls.addEventListener('change', () => renderer.render(scene, camera));