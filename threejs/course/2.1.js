// import THREE, { Points } from 'three';

// 创建场景
const scene = new THREE.Scene();

// 彩色线条
!function line() {
    const geometry = new THREE.Geometry(); // 空几何体对象
    const p1 = new THREE.Vector3(10, 0, 0); // 顶点1
    const p2 = new THREE.Vector3(0, 20, 0); // 顶点2
    geometry.vertices.push(p1, p2); // 将顶点坐标添加到geometry对象
    
    const color1 = new THREE.Color(0xFF0000); // 顶点1颜色
    const color2 = new THREE.Color(0x0000FF); // 顶点2颜色
    geometry.colors.push(color1, color2); // 顶点颜色添加到几何体对象

    const material = new THREE.LineBasicMaterial({
        vertexColors: THREE.VertexColors // 以顶点颜色为准
    });
    const line = new THREE.Line(geometry, material); // 线条模型
    scene.add(line);
}();

// // 创建点对象
// !function point() {
//     const geometry = new THREE.Geometry();
//     const p1 = new THREE.Vector3(13, 0, 0);
//     const p2 = new THREE.Vector3(3, 20, 0);
//     const p3 = new THREE.Vector3(15, 15, 0);
//     geometry.vertices.push(p1, p2, p3);
//     const material = new THREE.PointsMaterial({
//         color: 0x0000ff,
//         size: 10.0 // 点对象像素尺寸
//     });
//     const points = new THREE.Points(geometry, material);
//     scene.add(points);
// }();

// 彩色三角形
!function faces() {
    const geometry = new THREE.Geometry();
    const p1 = new THREE.Vector3(0, 0, 0);
    const p2 = new THREE.Vector3(80, 0, 0);
    const p3 = new THREE.Vector3(0, 80, 0);
    geometry.vertices.push(p1, p2, p3);
    const normal = new THREE.Vector3(0, 0, 1); // 三角面法向量
    const face = new THREE.Face3(0, 1, 2, normal); // 创建三角面
    
    // 顶点颜色
    const color1 = new THREE.Color(0xFF0000);
    const color2 = new THREE.Color(0x00FF00);
    const color3 = new THREE.Color(0x0000FF);
    face.vertexColors.push(color1, color2, color3);
    
    geometry.faces.push(face); // 三角面添加到几何体
    const material = new THREE.MeshLambertMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide // 两面可见
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.translateY(-100);
}();

// // 创建矩形平面网格模型(两个三角面)
// !function () {
//     const geometry = new THREE.Geometry();
//     const p1 = new THREE.Vector3(0, 0, 0);
//     const p2 = new THREE.Vector3(80, 0, 0);
//     const p3 = new THREE.Vector3(80, 80, 0);
//     const p4 = new THREE.Vector3(0, 80, 0);
//     geometry.vertices.push(p1, p2, p3, p4);
//     const normal = new THREE.Vector3(0, 0, 1);
//     const face0 = new THREE.Face3(0, 1, 2, normal);
//     const face1 = new THREE.Face3(0, 2, 3, normal);
//     geometry.faces.push(face0, face1);
//     const material = new THREE.MeshLambertMaterial({
//         color: 0xff00ff,
//         side: THREE.DoubleSide
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);
//     mesh.translateY(100);
// }();

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
camera.position.set(0, 400, 200); // 设置相机位置
camera.lookAt(scene.position); // 设置相机方向(指向场景)

// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.setClearColor(0xb9d3ff, 1); // 背景颜色
document.body.appendChild(renderer.domElement); // 往body插入canvas对象
// 执行渲染
renderer.render(scene, camera);