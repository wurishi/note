import * as THREE from "../../node_modules/three/build/three.module.js";
import * as GUI from "../../node_modules/dat.gui/build/dat.gui.module.js";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

function plane(width, height) {
  return (u, v, target) => {
    const x = (u - 0.5) * width;
    const y = (v + 0.5) * height;
    target.set(x, y, 0);
  };
}

class Particle {
  constructor(x, y, z, mass) {
    this.position = new THREE.Vector3();
    this.previous = new THREE.Vector3();
    this.original = new THREE.Vector3();
    this.a = new THREE.Vector3(0, 0, 0);
    this.mass = mass;
    this.invMass = 1 / mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();

    clothFunction(x, y, this.position);
    clothFunction(x, y, this.previous);
    clothFunction(x, y, this.original);
  }

  addForce(force) {
    this.a.add(this.tmp2.copy(force).multiplyScalar(this.invMass));
  }

  integrate(timesq) {
    const newPos = this.tmp.subVectors(this.position, this.previous);
    newPos.multiplyScalar(DRAG).add(this.position);
    newPos.add(this.a.multiplyScalar(timesq));

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;
    this.a.set(0, 0, 0);
  }
}

class Cloth {
  constructor(w = 10, h = 10) {
    this.w = w;
    this.h = h;
    this.init();
  }

  init() {
    const particles = [];
    const constraints = [];

    let u, v;

    // create particles
    for (v = 0; v <= this.h; v++) {
      for (u = 0; u <= this.w; u++) {
        particles.push(new Particle(u / this.w, v / this.h, 0, MASS));
      }
    }

    // structural
    for (v = 0; v < this.h; v++) {
      for (u = 0; u < this.w; u++) {
        constraints.push([
          particles[this.index(u, v)],
          particles[this.index(u, v + 1)],
          restDistance,
        ]);

        constraints.push([
          particles[this.index(u, v)],
          particles[this.index(u + 1, v)],
          restDistance,
        ]);
      }
    }

    for (u = this.w, v = 0; v < this.h; v++) {
      constraints.push([
        particles[this.index(u, v)],
        particles[this.index(u, v + 1)],
        restDistance,
      ]);
    }

    for (v = this.h, u = 0; u < this.w; u++) {
      constraints.push([
        particles[this.index(u, v)],
        particles[this.index(u + 1, v)],
        restDistance,
      ]);
    }

    this.particles = particles;
    this.constraints = constraints;
  }

  relaxed() {
    const diagonalDist = Math.sqrt(restDistance * restDistance * 2);

    const particles = [];
    const constraints = [];

    let u, v;

    // create particles
    for (v = 0; v <= this.h; v++) {
      for (u = 0; u <= this.w; u++) {
        particles.push(new Particle(u / this.w, v / this.h, 0, MASS));
      }
    }

    //
    for (v = 0; v < this.h; v++) {
      for (u = 0; u < this.w; u++) {
        constraints.push([
          particles[this.index(u, v)],
          particles[this.index(u + 1, v + 1)],
          diagonalDist,
        ]);

        constraints.push([
          particles[this.index(u + 1, v)],
          particles[this.index(u, v + 1)],
          diagonalDist,
        ]);
      }
    }

    this.particles = particles;
    this.constraints = constraints;
  }

  index(u, v) {
    return u + v * (this.w + 1);
  }
}

const params = {
  enableWind: true,
  showBall: false,
  togglePins,
};

const DAMPING = 0.03;
const DRAG = 1 - DAMPING;
const MASS = 0.1;
const restDistance = 25;

const xSegs = 10;
const ySegs = 10;

const clothFunction = plane(restDistance * xSegs, restDistance * ySegs);

const cloth = new Cloth(xSegs, ySegs);

const GRAVITY = 981 * 1.4;
const gravity = new THREE.Vector3(0, -GRAVITY, 0).multiplyScalar(MASS);

const TIMESTEP = 18 / 1000;
const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

let pins = [];

const windForce = new THREE.Vector3(0, 0, 0);

const ballPosition = new THREE.Vector3(0, -45, 0);
const ballSize = 60;

const tmpForce = new THREE.Vector3();

const diff = new THREE.Vector3();

function satisfyConstraints(p1, p2, distance) {
  diff.subVectors(p2.position, p1.position);
  const currentDist = diff.length;
  if (currentDist === 0) return;
  const correction = diff.multiplyScalar(1 - distance / currentDist);
  const correctionHalf = correction.multiplyScalar(0.5);
  p1.position.add(correctionHalf);
  p2.position.add(correctionHalf);
}

function simulate(now) {
  throw "simulate";
}

const pinsFormation = [];
pins = [6];
pinsFormation.push(pins);
pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
pinsFormation.push(pins);
pins = [0];
pinsFormation.push(pins);
pins = [0, cloth.w];
pinsFormation.push(pins);
pins = pinsFormation[1];

function togglePins() {
  pins = pinsFormation[~~(Math.random() * pinsFormation.length)];
}

let container, stats;
let camera, scene, renderer;

let clothGeometry;
let sphere;
let object;

init();
animate(0);

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcce0ff);
  scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);

  // camera
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(1000, 50, 1500);

  // lights
  scene.add(new THREE.AmbientLight(0x666666));

  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  light.castShadow = true;

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  const d = 300;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 1000;

  scene.add(light);

  // cloth material
  const loader = new THREE.TextureLoader();
  const clothTexture = loader.load("../textures/circuit_pattern.png");
  clothTexture.anisotropy = 16;
  const clothMaterial = new THREE.MeshLambertMaterial({
    map: clothTexture,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
  });

  // cloth geometry
  clothGeometry = new THREE.ParametricBufferGeometry(
    clothFunction,
    cloth.w,
    cloth.h
  );

  // cloth mesh
  object = new THREE.Mesh(clothGeometry, clothMaterial);
  object.position.set(0, 0, 0);
  object.castShadow = true;
  scene.add(object);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1000;
  controls.maxDistance = 5000;
}

function animate() {}
