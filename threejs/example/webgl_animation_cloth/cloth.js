import { clothFunction, DRAG, restDistance, MASS } from "./utils.js";
import * as THREE from "../../node_modules/three/build/three.module.js";

export class Cloth {
  particles = [];
  constraints = [];

  constructor(w = 10, h = 10) {
    this.w = w;
    this.h = h;

    const particles = [];
    const constraints = [];

    for (let v = 0; v <= h; v++) {
      for (let u = 0; u <= w; u++) {
        particles.push(new Particle(u / w, v / h, 0, MASS));
      }
    }

    const index = this.index.bind(this);

    for (let v = 0; v < h; v++) {
      for (let u = 0; u < w; u++) {
        constraints.push([
          particles[index(u, v)],
          particles[index(u, v + 1)],
          restDistance,
        ]);

        constraints.push([
          particles[index(u, v)],
          particles[index(u + 1, v)],
          restDistance,
        ]);
      }
    }

    for (let u = w, v = 0; v < h; v++) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u, v + 1)],
        restDistance,
      ]);
    }

    for (let v = h, u = 0; u < w; u++) {
      constraints.push([
        particles[index(u, v)],
        particles[index(u + 1, v)],
        restDistance,
      ]);
    }

    this.particles = particles;
    this.constraints = constraints;
  }

  index(u, v) {
    return u + v * (this.w + 1);
  }
}

export class Particle {
  position = new THREE.Vector3();
  previous = new THREE.Vector3();
  original = new THREE.Vector3();
  a = new THREE.Vector3(0, 0, 0);
  mass = 0;
  invMass = 0;
  tmp = new THREE.Vector3();
  tmp2 = new THREE.Vector3();

  constructor(x, y, z, mass) {
    this.mass = mass;
    this.invMass = 1 / mass;
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
