// import THREE from "three";

// 创建场景
const scene = new THREE.Scene();

const boxMesh = new THREE.Mesh(
  new THREE.BoxGeometry(20, 20, 20),
  new THREE.MeshNormalMaterial({ color: 0xff0000 })
);
const circleMesh = new THREE.Mesh(
  new THREE.CircleGeometry(20, 20),
  new THREE.MeshNormalMaterial({ color: 0x00ff00 })
);
circleMesh.position.set(20, 20, 0);
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(20, 20, 20),
  new THREE.MeshNormalMaterial({ color: 0x0000ff })
);
sphereMesh.position.set(-20, 20, 0);

scene.add(boxMesh, circleMesh, sphereMesh);

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
camera.position.set(0, 0, 50); // 设置相机位置
camera.lookAt(scene.position); // 设置相机方向(指向场景)

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xb9d3ff, 1); // 背景颜色
document.body.appendChild(renderer.domElement); // 往body插入canvas对象
// 执行渲染
renderer.render(scene, camera);

const controls = new THREE.OrbitControls(camera, renderer.domElement); // 创建操作控件
controls.addEventListener("change", () => renderer.render(scene, camera));

window.addEventListener("click", ray);

function ray(event) {
  const Sx = event.clientX;
  const Sy = event.clientY;
  // 屏幕坐标->标准设备坐标
  const x = (Sx / window.innerWidth) * 2 - 1;
  const y = (Sy / window.innerHeight) * 2 + 1;
  const standardVector = new THREE.Vector3(x, y, 0.5);
  // 标准设备坐标->世界坐标
  const worldVector = standardVector.unproject(camera);
  // 射线投射方向单位向量
  const ray = worldVector.sub(camera.position).normalize();
  // 创建射线投射器
  const raycaster = new THREE.Raycaster(camera.position, ray);
  // 返回射线选中的对象
  const meshArr = [boxMesh, circleMesh, sphereMesh];
  const intersects = raycaster.intersectObjects(meshArr);
  meshArr.forEach(({ material }) => {
    material.transparent = false;
  });
  intersects.forEach(({ object }) => {
    object.material.transparent = true;
    object.material.opacity = 0.6;
  });
  renderer.render(scene, camera);
}
