import * as tf from "@tensorflow/tfjs";

!(function () {
  tf.tidy(() => {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" }),
        tf.layers.dense({ units: 10, activation: "softmax" }),
      ],
    });
    model.weights.forEach((w) => console.log(w.name, w.shape));

    model.weights.forEach((w) => {
      const newVals = tf.randomNormal(w.shape);
      w.val.assign(newVals);
    });

    // 4.3
    model.compile({
      optimizer: "sgd",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
  });
})();
console.log("------ 4.2 模型参数 ------");
