// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 圆弧-点模式渲染
!function () {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 100, 0, 0.5 * Math.PI);
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.PointsMaterial({
        color: 0x0000ff,
        size: 10.0
    });
    const line = new THREE.Points(geometry, material);
    scene.add(line);
}();

// 圆弧-线模式渲染
!function () {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 100, 0, 0.5 * Math.PI);
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    line.translateX(100);
}();

// 圆弧-面模式渲染
!function () {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 100, 0, 0.5 * Math.PI);
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshLambertMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    mesh.translateX(-100);
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