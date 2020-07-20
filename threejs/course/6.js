// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 克隆几何体
(function () {
    const box = new THREE.BoxGeometry(10, 10, 10);
    const box2 = box.clone(); // 克隆几何体
    box.translate(20, 0, 0); // 平移源几何体
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const material2 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(box, material);
    const mesh2 = new THREE.Mesh(box2, material2);
    scene.add(mesh);
    scene.add(mesh2);
})();

// 复制几何体
!function () {
    const box = new THREE.BoxGeometry(10, 10, 10);
    const sphere = new THREE.SphereGeometry(10, 40, 40);
    box.copy(sphere); // 球体数据复制到box几何体
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const mesh = new THREE.Mesh(box, material);
    scene.add(mesh);
    mesh.translateY(100);
}();


// 网格模型克隆
!function () {
    const box = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const mesh = new THREE.Mesh(box, material);
    mesh.translateY(-100);
    const mesh2 = mesh.clone();
    mesh.translateX(20);
    box.scale(1.5, 1.5, 1.5); // 几何体缩放
    scene.add(mesh);
    scene.add(mesh2);
}();

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