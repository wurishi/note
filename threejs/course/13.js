// import THREE from "three";

// 创建场景
const scene = new THREE.Scene();

const box = new THREE.BoxGeometry(40, 5, 40);
const boxMesh = new THREE.Mesh(
  box,
  new THREE.MeshPhongMaterial({ color: 0x00ff00 })
);

scene.add(boxMesh);

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
// function render() {
//   renderer.render(scene, camera);
//   requestAnimationFrame(render);
// }
// render();
renderer.render(scene, camera);

const controls = new THREE.OrbitControls(camera, renderer.domElement); // 创建操作控件
controls.addEventListener("change", () => renderer.render(scene, camera));

const div = document.createElement("div");
div.innerHTML = "立方体";
div.style.padding = "5px";
div.style.position = "absolute";
div.style.backgroundColor = "rgba(155,0,155,0.8)";
document.body.appendChild(div);

const btn = document.createElement("button");
btn.textContent = "tag";
btn.style.position = "absolute";
btn.style.top = 0;
btn.style.right = 0;
document.body.appendChild(btn);
btn.addEventListener("click", () => {
  const worldVector = new THREE.Vector3(
    boxMesh.position.x,
    boxMesh.position.y,
    boxMesh.position.z
  );
  const standardVector = worldVector.project(camera);
  const a = window.innerWidth / 2;
  const b = window.innerHeight / 2;
  const x = Math.round(standardVector.x * a + a);
  const y = Math.round(standardVector.y * b + b);

  div.style.left = x + "px";
  div.style.top = y + "px";
});
