import * as tf from "@tensorflow/tfjs";

!(function () {
  const x = tf.tensor([1, 2, 3, 4]);
  const y = x.square(); // 相当于 tf.square(x)
  y.print();
})();
console.log("------ 所有的元素执行x2 ------");

!(function () {
  const a = tf.tensor([1, 2, 3, 4]);
  const b = tf.tensor([10, 20, 30, 40]);
  const y = a.add(b); // 相当于 tf.add(a,b)
  y.print();
})();
console.log("------ 对应相加 ------");
