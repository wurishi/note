import * as tf from "@tensorflow/tfjs";

class SquaredSumLayer extends tf.layers.Layer {
  constructor() {
    super({});
  }

  computeOutputShape(inputShape) {
    return [];
  }

  call(input, kwargs) {
    return input.square().sum();
  }

  // 每个 Layer 都需要一个唯一的名字
  getClassName() {
    return "SquaredSum";
  }
}

!(function () {
  const t = tf.tensor([-2, 1, 0, 5]);
  const o = new SquaredSumLayer().apply(t);
  o.print();
})();

console.log("------ SquaredSumLayer ------");
