import * as tf from "@tensorflow/tfjs";

!(function example1() {
  // 从一个多维数组创建一个rank-2的张量矩阵
  const a = tf.tensor([
    [1, 2],
    [3, 4],
  ]);
  console.log("shape:", a.shape);

  // 或者可以用一个一维数组并指定特定的形状来创建一个张量
  const shape = [2, 2];
  const b = tf.tensor([1, 2, 3, 4], shape);
  console.log("shape:", b.shape);
  console.log("dtype:", b.dtype);
  b.print();
})();
console.log("------ example1 end ------");

!(function example2() {
  const a = tf.tensor(
    [
      [1, 2],
      [3, 4],
    ],
    [2, 2],
    "int32"
  );
  console.log("shape", a.shape);
  console.log("dtype", a.dtype);
  a.print();
})();
console.log("------ example2 end ------");

!(function () {
  const a = tf.tensor([
    [1, 2],
    [3, 4],
  ]);
  console.log("a shape:", a.shape);
  a.print();

  const b = a.reshape([4, 1]);
  console.log("b shape:", b.shape);
  b.print();
})();
console.log("------ 修改张量的形状 end ------");

!(function () {
  const a = tf.tensor([
    [1, 2],
    [3, 4],
  ]);
  // 返回多维数组的值
  a.array().then((arr) => console.log(arr, "await array"));
  // console.log(a.array(), "await");
  // 返回张是所包含的所有值的一维数组
  a.data().then((arr) => console.log(arr, "await data"));
  // console.log(a.data(), "await");

  console.log(a.arraySync());
  console.log(a.dataSync());
})();
console.log("------ 获取张量的值 end ------");
