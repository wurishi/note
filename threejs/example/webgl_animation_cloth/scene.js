import * as THREE from "../../node_modules/three/build/three.module.js";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "../../node_modules/dat.gui/build/dat.gui.module.js";
import { Cloth } from "./cloth.js";
import { xSegs, ySegs, clothFunction, MASS, TIMESTEP_SQ } from "./utils.js";

const GRAVITY = 981 * 1.4;

export class Main {
  container = null;
  scene = null;
  camera = null;
  renderer = null;
  stats = null;
  cloth = new Cloth(xSegs, ySegs);
  ballSize = 60;
  clothGeometry = null;
  sphere = null;
  ballPosition = new THREE.Vector3(0, -45, 0);
  windForce = new THREE.Vector3(0, 0, 0);
  tmpForce = new THREE.Vector3();
  gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(MASS);

  constructor() {
    this.init();
    this.animate(0);
  }

  init() {
    const container = document.createElement("div");
    document.body.appendChild(container);
    this.container = container;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcce0ff);
    scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(1000, 50, 1500);
    this.camera = camera;

    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 300;
    const { camera: lightCamera } = light.shadow;
    lightCamera.left = -d;
    lightCamera.right = d;
    lightCamera.top = d;
    lightCamera.bottom = -d;
    lightCamera.far = 1000;
    scene.add(light);

    this.createCloth();
    this.createSphere();
    this.createGround();
    this.createPoles();

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer = renderer;

    container.appendChild(renderer.domElement);

    renderer.outputEncoding = THREE.sRGBEncoding;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    const stats = new Stats();
    container.appendChild(stats.dom);
    this.stats = stats;

    window.addEventListener("resize", this.onWindowResize, false);

    const mgui = new MGUI(1);
    this.params = mgui.params;
  }

  createCloth() {
    const loader = new THREE.TextureLoader();
    const clothTexture = loader.load("./circuit_pattern.png");
    clothTexture.anisotropy = 16;

    const clothMaterial = new THREE.MeshLambertMaterial({
      map: clothTexture,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
    });

    const clothGeometry = new THREE.ParametricBufferGeometry(
      clothFunction,
      this.cloth.w,
      this.cloth.h
    );
    this.clothGeometry = clothGeometry;

    const object = new THREE.Mesh(clothGeometry, clothMaterial);
    object.position.set(0, 0, 0);
    object.castShadow = true;
    this.scene.add(object);
  }

  createSphere() {
    const ballGeo = new THREE.SphereBufferGeometry(this.ballSize, 32, 16);
    const ballMaterial = new THREE.MeshLambertMaterial();

    const sphere = new THREE.Mesh(ballGeo, ballMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.visible = false;
    this.scene.add(sphere);
    this.sphere = sphere;
  }

  createGround() {
    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load("./grasslight-big.jpg");
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial({
      map: groundTexture,
    });

    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(20000, 20000),
      groundMaterial
    );
    mesh.position.y = -250;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  createPoles() {
    const poleGeo = new THREE.BoxBufferGeometry(5, 375, 5);
    const poleMat = new THREE.MeshLambertMaterial();

    [
      [-125, -62],
      [125, -62],
    ].forEach((pos) => {
      const mesh = new THREE.Mesh(poleGeo, poleMat);
      mesh.position.x = pos[0];
      mesh.position.y = pos[1];
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      this.scene.add(mesh);
    });

    const mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(255, 5, 5),
      poleMat
    );
    mesh.position.y = -250 + 750 / 2;
    mesh.position.x = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.scene.add(mesh);

    const gg = new THREE.BoxBufferGeometry(10, 10, 10);
    [
      [125, -250],
      [-125, -250],
    ].forEach((pos) => {
      const mesh = new THREE.Mesh(gg, poleMat);
      mesh.position.x = pos[0];
      mesh.position.y = pos[1];
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      this.scene.add(mesh);
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    const p = this.cloth.particles;
    for (let i = 0, il = p.length; i < il; i++) {
      const v = p[i].position;
      this.clothGeometry.attributes.position.setXYZ(i, v.x, v.y, v.z);
    }

    this.clothGeometry.attributes.position.needsUpdate = true;
    this.clothGeometry.computeVertexNormals();

    this.sphere.position.copy(this.ballPosition);

    this.renderer.render(this.scene, this.camera);
  }

  animate(now) {
    requestAnimationFrame((time) => this.animate(time));
    this.simulate(now);
    this.render();
    this.stats.update();
  }

  simulate(now) {
    const windStrength = Math.cos(now / 7000) * 20 + 40;

    this.windForce.set(
      Math.sin(now / 2000),
      Math.cos(now / 3000),
      Math.sin(now / 1000)
    );
    this.windForce.normalize();
    this.windForce.multiplyScalar(windStrength);

    this.simulateWind();
    this.simulateBall(now);
  }

  simulateWind() {
    if (this.params.enableWind) {
      const normal = new THREE.Vector3();
      const indices = this.clothGeometry.index;
      const normals = this.clothGeometry.attributes.normal;
      let particles = this.cloth.particles;

      for (let i = 0, il = indices.count; i < il; i += 3) {
        for (let j = 0; j < 3; j++) {
          const indx = indices.getX(i + j);
          normal.fromBufferAttribute(normals, indx);
          this.tmpForce
            .copy(normal)
            .normalize()
            .multiplyScalar(normal.dot(this.windForce));
          particles[indx].addForce(this.tmpForce);
        }
      }
    }

    for (
      let particles = this.cloth.particles, i = 0, il = particles.length;
      i < il;
      i++
    ) {
      const particle = particles[i];
      particle.addForce(this.gravity);
      particle.integrate(TIMESTEP_SQ);
    }

    for (let i = 0, il = this.cloth.constraints.length; i < il; i++) {
      const constraint = this.cloth.constraints[i];
      this.satisfyConstraints(constraint[0], constraint[1], constraint[2]);
    }
  }

  simulateBall(now) {
    this.ballPosition.z = -Math.sin(now / 600) * 90;
    this.ballPosition.x = Math.cos(now / 400) * 70;
    if (this.params.showBall) {
      this.sphere.visible = true;
      for (
        let particles = this.cloth.particles, i = 0, il = particles.length;
        i < il;
        i++
      ) {
        const particle = particles[i];
        const pos = particle.position;
        this.diff.subVectors(pos, this.ballPosition);
        if (this.diff.length() < this.ballSize) {
          this.diff.normalize().multiplyScalar(this.ballSize);
          pos.copy(this.ballPosition).add(this.diff);
        }
      }
    } else {
      this.sphere.visible = false;
    }
  }

  diff = new THREE.Vector3();

  satisfyConstraints(p1, p2, distance) {
    // console.log(p1, p2, distance);
    this.diff.subVectors(p2.position, p1.position);
    const currentDist = this.diff.length();
    if (currentDist === 0) return;
    const correction = this.diff.multiplyScalar(1 - distance / currentDist);
    const correctionHalf = correction.multiplyScalar(0.5);
    p1.position.add(correctionHalf);
    p2.position.sub(correctionHalf);
  }
}

class MGUI {
  pinsFormation = [];
  pins = [];
  params = {
    enableWind: true,
    showBall: false,
    togglePins: () => {},
  };
  TESTING = undefined;

  constructor(w, TESTING) {
    this.TESTING = TESTING;

    this.pinsFormation.push([6]);

    this.pinsFormation.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    this.pinsFormation.push([0]);

    this.pinsFormation.push([]);

    this.pinsFormation.push([0, w]);

    this.pins = this.pinsFormation[1];

    this.params.togglePins = this.togglePins;

    this.initGUI();
  }

  togglePins() {
    this.pins = this.pinsFormation[
      ~~(Math.random() * this.pinsFormation.length)
    ];
  }

  initGUI() {
    const gui = new GUI();
    gui.add(this.params, "enableWind");
    gui.add(this.params, "showBall");
    gui.add(this.params, "togglePins");

    if (this.TESTING) {
      for (let i = 0; i < 50; i++) {
        // TODO: simulate(500 - 10 * i);
      }
    }
  }
}
