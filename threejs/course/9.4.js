// import THREE from 'three';

// 创建场景
const scene = new THREE.Scene();

const box = new THREE.BoxGeometry(70, 255, 480);
const texture1 = new THREE.Texture();
const texture2 = new THREE.Texture();
const materialArr = [
    new THREE.MeshPhongMaterial({ map: texture1 }),
    new THREE.MeshPhongMaterial({ map: texture2 }),
    new THREE.MeshPhongMaterial({ map: texture1 }),
    new THREE.MeshPhongMaterial({ map: texture2 }),
    new THREE.MeshPhongMaterial({ map: texture1 }),
    new THREE.MeshPhongMaterial({ map: texture2 }),
];
// const facematerial = new THREE.MultiMaterial(materialArr);
const mesh = new THREE.Mesh(box, materialArr);
scene.add(mesh);

const image1 = new Image();
image1.onload = () => {
    texture1.image = image1;
    texture1.needsUpdate = true;
    renderer.render(scene, camera);
}
image1.src = document.getElementById('imageBase64_1').innerText;

const image2 = new Image();
image2.onload = () => {
    texture2.image = image2;
    texture2.needsUpdate = true;
    renderer.render(scene, camera);
}
image2.src = document.getElementById('imageBase64_2').innerText;

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