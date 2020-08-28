export const restDistance = 25;
export const xSegs = 10;
export const ySegs = 10;
export const DAMPING = 0.03;
export const DRAG = 1 - DAMPING;
export const MASS = 0.1;
export const TIMESTEP = 18 / 1000;
export const TIMESTEP_SQ = TIMESTEP * TIMESTEP;

function plane(width, height) {
  return function (u, v, target) {
    const x = (u - 0.5) * width;
    const y = (v + 0.5) * height;
    const z = 0;
    target.set(x, y, z);
  };
}

export const clothFunction = plane(restDistance * xSegs, restDistance * ySegs);
