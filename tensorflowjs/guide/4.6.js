import * as tf from "@tensorflow/tfjs";

!(function () {
  tf.tidy(async () => {
    const w1 = tf.variable(tf.randomNormal([784, 32]));
    const b1 = tf.variable(tf.randomNormal([32]));
    const w2 = tf.variable(tf.randomNormal([32, 10]));
    const b2 = tf.variable(tf.randomNormal([10]));

    function model(x) {
      return x.matMul(w1).add(b1).relu().matMul(w2).add(b2);
    }

    const xs = tf.data.generator(data);
    const ys = tf.data.generator(label);
    const ds = tf.data.zip({ xs, ys }).shuffle(100).batch(32);

    const optimizer = tf.train.sgd(0.1);
    for (let epoch = 0; epoch < 5; epoch++) {
      await ds.forEachAsync(({ xs, ys }) => {
        optimizer.minimize(() => {
          const predYs = model(xs);
          const loss = tf.losses.softmaxCrossEntropy(ys, predYs);
          loss.data().then((l) => console.log("Loss", l));
          return loss;
        });
      });
      console.log("Epoch", epoch);
    }
  });

  function* data() {
    for (let i = 0; i < 100; i++) {
      yield tf.randomNormal([784]);
    }
  }
  function* label() {
    for (let i = 0; i < 100; i++) {
      yield tf.randomUniform([10]);
    }
  }
})();
