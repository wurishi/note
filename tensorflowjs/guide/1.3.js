import * as tf from "@tensorflow/tfjs";

!(function () {
  const a = tf.tensor([
    [1, 2],
    [3, 4],
  ]);
  a.dispose(); // 相当于 tf.dispose(a)
  console.log(a);
})();
console.log("------ dispose ------");

!(function () {
  const a = tf.tensor([
    [1, 2],
    [3, 4],
  ]);
  const y = tf.tidy(() => {
    const result = a.square().log().neg();
    return result;
  });
  console.log(tf.memory());
  y.print();
  y.dispose();
  console.log(tf.memory());
})();
console.log("------ tf.tidy ------");
