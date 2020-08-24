import * as tf from "@tensorflow/tfjs";

!(function () {
  tf.tidy(() => {
    const model1 = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" }),
        tf.layers.dense({ units: 10, activation: "softmax" }),
      ],
    });

    const model2 = tf.sequential();
    model2.add(
      tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" })
    );
    model2.add(tf.layers.dense({ units: 10, activation: "softmax" }));
  });
})();
console.log("------ sequential ------");

!(function () {
  // 用apply()方法创建任意计算图
  const input = tf.input({ shape: [784] });
  const dense1 = tf.layers
    .dense({ units: 32, activation: "relu" })
    .apply(input);
  const dense2 = tf.layers
    .dense({ units: 10, activation: "softmax" })
    .apply(dense1);
  const model = tf.model({ inputs: input, outputs: dense2 });
  // 模型总览
  model.summary();
  // 保存模型
  model.save("localstorage://my-model-1");

  // 可以用来单独测试每一层并检查它们的输出
  const t = tf.tensor([-2, 1, 0, 5]);
  const o = tf.layers.activation({ activation: "relu" }).apply(t);
  o.print();
})();
console.log("------ functional ------");
