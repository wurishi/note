// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 创建旋转网格模型
!function () {
    const points = [
        new THREE.Vector2(50, 60),
        new THREE.Vector2(25, 0),
        new THREE.Vector2(50, -60)
    ];
    const geometry = new THREE.LatheGeometry(points, 30);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
    });
    material.wireframe = true;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}();

// 样条曲线插值计算
!function () {
    const shape = new THREE.Shape();
    const points = [
        new THREE.Vector2(50, 60),
        new THREE.Vector2(25, 0),
        new THREE.Vector2(50, -60)
    ]
    shape.splineThru(points); // 顶点带入样条插值计算函数
    const splinePoints = shape.getPoints(20); // 插值计算细分数20
    const geometry = new THREE.LatheGeometry(splinePoints, 30);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide,
    });
    material.wireframe = true;
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