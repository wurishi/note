import * as tf from "@tensorflow/tfjs";

!(function () {
  // 获取当前正使用的 backend
  console.log(tf.getBackend());

  // 手动切换backend
  tf.setBackend("cpu");
  console.log(tf.getBackend());
})();
console.log("------ Backends ------");
