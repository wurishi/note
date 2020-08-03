import * as tf from "@tensorflow/tfjs";

!(function () {
  tf.tidy(() => {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" }),
        tf.layers.dense({ units: 10, activation: "softmax" }),
      ],
    });

    // model.weights.forEach((w) => {
    //   const newVals = tf.randomNormal(w.shape);
    //   w.val.assign(newVals);
    // });

    model.compile({
      optimizer: "sgd",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    // fit()

    // const data = tf.randomNormal([100, 784]);
    // const labels = tf.randomUniform([100, 10]);

    // // console.log(data, labels);
    // function onBatchEnd(batch, logs) {
    //   console.log("Accuracy", logs.acc);
    // }

    // model
    //   .fit(data, labels, {
    //     epochs: 5,
    //     batchSize: 32,
    //     callbacks: { onBatchEnd },
    //   })
    //   .then((info) => {
    //     console.log("Final accuracy", info.history.acc);
    //   });

    // fitDataset()
    const xs = tf.data.generator(data);
    const ys = tf.data.generator(label);
    const ds = tf.data
      .zip({ xs, ys }) //
      .shuffle(100) // bufferSize = 100
      .batch(32);

    model.fitDataset(ds, { epochs: 5 }).then((info) => {
      console.log("Accuracy", info.history.acc);
    });

    const prediction = model.predict(tf.randomNormal([3, 784]));
    prediction.print();
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
