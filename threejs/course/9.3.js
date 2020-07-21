// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

// 立方体网格模型
const box = new THREE.BoxGeometry(100, 100, 100);
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const boxMesh = new THREE.Mesh(box, boxMaterial);
scene.add(boxMesh);

// 纹理贴图网格
const geometry = new THREE.Geometry(); // 空几何体对象
// 顶点坐标(纹理映射位置)
const p1 = new THREE.Vector3(0, 0, 0);
const p2 = new THREE.Vector3(80, 0, 0);
const p3 = new THREE.Vector3(80, 80, 0);
const p4 = new THREE.Vector3(0, 80, 0);
geometry.vertices.push(p1, p2, p3, p4);
// 三角面
const normal = new THREE.Vector3(0, 0, 1); // 三角面法向量
const face0 = new THREE.Face3(0, 1, 2, normal);
const face1 = new THREE.Face3(0, 2, 3, normal);
geometry.faces.push(face0, face1); // 三角面添加到几何体
// 纹理坐标
const t0 = new THREE.Vector2(0, 0); // 图片左下角
const t1 = new THREE.Vector2(1, 0); // 图片右下角
const t2 = new THREE.Vector2(1, 1); // 图片右上角
const t3 = new THREE.Vector2(0, 1); // 图片左上角
const uv1 = [t0, t1, t2];
const uv2 = [t0, t2, t3];
geometry.faceVertexUvs[0].push(uv1, uv2);
const texture = new THREE.Texture();
const material = new THREE.MeshLambertMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(-40, -40, 50.1);
scene.add(mesh);

const image = new Image();
image.src = document.getElementById('imageBase64').innerText;
image.onload = () => {
    texture.image = image;
    texture.needsUpdate = true;
    renderer.render(scene, camera);
};

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