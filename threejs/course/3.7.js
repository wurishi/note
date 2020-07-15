// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建平面网格模型
function plane(u, v, v3) {
    const width = 50, height = 100;
    const x = u * width;
    const y = v * height;
    const z = 0;
    v3.x = x;
    v3.y = y;
    v3.z = z;
}
const geometry = new THREE.ParametricGeometry(plane, 10, 10);
const material = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    side: THREE.DoubleSide
});
material.wireframe = true; // 线条模式渲染(查看细分数)
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 旋转抛物面: z = a②*(x②+y②）
function paraboloid(u, v, v3) {
    const k = 100;
    const a = 0.2; // 旋转抛物面焦点
    v3.x = (u - 0.5) * k;
    v3.y = (v - 0.5) * k;
    v3.z = Math.pow(a, 2) * (Math.pow(v3.x, 2) + Math.pow(v3.y, 2));
}
!function () {
    const geometry = new THREE.ParametricGeometry(paraboloid, 10, 10);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide
    });
    material.wireframe = true; // 线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.translateX(100);
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