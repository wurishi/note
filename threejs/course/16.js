// import THREE from "three";
// import * as dat from "dat.gui";

// 创建场景
const scene = new THREE.Scene();

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20),
  new THREE.MeshPhongMaterial({ color: 0x0000ff })
);

scene.add(boxMesh);

// UI

const controls = {
  缩放系数: 1,
  转速: 0.01,
  颜色: boxMesh.material.color.getStyle(),
};

const gui = new dat.GUI(); // 创建 GUI 对象
const folder = gui.addFolder("菜单"); // 添加文件夹
gui.domElement.style.position = "absolute";
gui.domElement.style.top = 0;
gui.domElement.style.left = 0;

folder.addColor(controls, "颜色");
folder.add(controls, "缩放系数", 0.1, 2.5);
folder.add(controls, "转速", { 低速: 0.005, 中速: 0.01, 高速: 0.1 });
folder.open();

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

  boxMesh.scale.x = controls.缩放系数;
  boxMesh.rotateY(controls.转速);
  boxMesh.material.color.setStyle(controls.颜色);

  requestAnimationFrame(render);
}
render();

const ocontrols = new THREE.OrbitControls(camera, renderer.domElement); // 创建操作控件
// ocontrols.addEventListener("change", () => renderer.render(scene, camera));
