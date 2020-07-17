// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 几何体对象
const cylinder = new THREE.CylinderGeometry(50, 50, 5, 40); // 圆柱
const box = new THREE.BoxGeometry(40, 5, 40); // 立方体
// 材质对象
const material1 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const material2 = new THREE.MeshPhongMaterial({ color: 0xff00ff });
// const material3 = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
// 网格模型对象
const cylinderMesh = new THREE.Mesh(cylinder, material1);
const boxMesh = new THREE.Mesh(box, material2);
// 包装成ThreeBSP对象
const cylinderBSP = new ThreeBSP(cylinderMesh);
const boxBSP = new ThreeBSP(boxMesh);
const result = cylinderBSP.subtract(boxBSP);

// ThreeBSP对象转化为网格模型对象
const mesh = result.toMesh(material2);
scene.add(mesh);

// scene.add(cylinderMesh);
// scene.add(boxMesh);
// 光源设置
const point = new THREE.PointLight(0xffffff);// 点光源
point.position.set(400, 200, 300); // 点光源位置
scene.add(point); // 点光源添加到场景中

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