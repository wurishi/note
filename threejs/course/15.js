// import THREE from "three";

// 创建场景
const scene = new THREE.Scene();

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshNormalMaterial({ color: 0xff0000 })
);

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(10, 10),
  new THREE.MeshNormalMaterial({ color: 0x00ff00 })
);
sphereMesh.position.set(20, 0, 0);

scene.add(boxMesh, sphereMesh);

// 光源设置
const point = new THREE.PointLight(0xffffff); // 点光源
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
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

const transformControl = new THREE.TransformControls(
  camera,
  renderer.domElement
);
scene.add(transformControl);
// transformControl.setMode("rotate");

const dragControl = new THREE.DragControls(
  scene.children,
  camera,
  renderer.domElement
);
// hoveron: 鼠标平移到
dragControl.addEventListener("hoveron", (event) => {
  transformControl.attach(event.object);
  // console.log(event);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement); // 创建操作控件
// controls.addEventListener('change', () => renderer.render(scene, camera));
