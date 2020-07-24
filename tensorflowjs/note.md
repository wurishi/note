# 一. 教程

## 1. 安装

### 1.1 安装 TensorFlow.js

#### 选项1: 安装带有原生C++绑定的 TensorFlow.js.

```shell
npm install @tensorflow/tfjs-node
```

#### 选项2: (仅限Linux) 如果系统支持 CUDA 的 NVIDIA®GPU.

```shell
npm install @tensorflow/tfjs-node-gpu
```

#### 选项3: 安装纯 Javascript 版本, 这是性能方面最慢的选项.

```shell
npm install @tensorflow/tfjs
```

#### TypeScript

如果项目使用严格的空值检查, 或者在编译过程中遇到错误, 可能需要在 tsconfig.json 文件中设置 `skipLibCheck: true`.

### 1.2 安装可视化库

tfjs-vis 是一个用于在浏览器内实现可视化的小型库.

```shell
npm install @tensorflow/tfjs-vis
```



## 2. 将曲线拟合到二维数据

[代码](2/index.html)

### 2.1 介绍

### 2.2 设置

### 2.3 加载数据

目标: 训练一个模型, 该模型根据一个 horsepower 预测 mpg.

### 2.4 定义模型

模型体系结构的含义是: "模型在执行时将运行哪些功能" 或 "模型将使用哪种算法来计算其答案".

ML模型是一种接受输入并产生输出的算法. 使用神经网络时, 该算法是一组神经元层, 其中"权重"控制着它们的输出. 训练过程即通过学习得到这些"权重"的理想值.

- 实例化模型

  ```javascript
  const model = tf.sequential();
  ```

  创建一个tf.Model对象, sequential表示模型的顺序是由输入直接向下流至输出的. 其他类型的模型可以具有分支, 甚至可以具有多个输入和输出.

- 创建输入层

  ```javascript
  model.add(
      tf.layers.dense({
        inputShape: [1],
        units: 1,
        useBias: true,
      })
    );
  ```

  为神经网络添加一个输入层, 该输入层会自动连接到带有一个隐藏单元的"密集"层. `dense`(密集)图层是一种图层类型, 将其输入乘以一个矩阵 (weights), 然后与一个数字 (bias) 相加. 由于这是第一层, 因此需要定义 `inputShape`. `inputShape: [1]`表示将数字1作为输入 (即汽车的horsepower).

  units: 设置权重矩阵在图层中的大小. 这里设置为1, 表示每个数据的输入权重都为1.

  useBias: 默认即为 true.

- 创建输出层

  ```javascript
  model.add(
      tf.layers.dense({
        units: 1,
        useBias: true,
      })
    );
  ```

- 创建一个实例

  ```javascript
  const model = createModel();
    tfvis.show.modelSummary({ name: "Model Summary" }, model);
  ```

### 2.5 准备训练数据

为了获得 TensorFlow.js 的性能优势, 需要将数据转换为张量. 并对数据进行一些最佳实践的转换, 改组和标准化.

- step1: 随机洗数据

  将数据随机分配给训练算法. 改组很重要, 因为通常在训练过程中, 数据集会被分成较小的子集, 改组可以让每个批次从整个数据分布中获取各种数据, 这样的好处是可以帮助模型:

  - 不学习纯粹依赖于数据输入顺序.
  - 对子组的结构不敏感 (例如: 如果在训练前半段只看到高马力的汽车, 它可能会发现一种不适用于其他数据集的关系)

- step2: 转换为张量

- step3: 规范化数据 (归一化)

  规范化很重要, 因为使用 tensorflow.js 构建的许多机器学习模型的内部设计为可以处理不太大的数字. 标准化范围一般为 `0 ~ 1` 或者通用范围 `-1 ~ 1`.

### 2.6 训练模型

- model.compile(optimizer, loss, metrics) :

  | 参数      | 含义                                                         |
  | --------- | ------------------------------------------------------------ |
  | optimizer | 优化器, 用于控制模型更新的算法, TensorFlow.js 提供了许多优化器. |
  | loss      | 此函数告诉模型学习每个批次 (数据子集) 时的性能如何.          |

- model.fit(inputs, labels, options) : 

  options 属性:

  | 属性      | 含义                                                         |
  | --------- | ------------------------------------------------------------ |
  | batchSize | 每次训练迭代的数据子集的大小, 常见批量大小通常在 32~512 之间. |
  | epochs    | 模型迭代整个数据集的次数.                                    |

### 2.7 作出预测

- 生成示例

  ```javascript
  const xs = tf.linspace(0, 1, 100);
  const preds = model.predict(xs.reshape([100, 1]));
  ```

  创建100个新的示例供模型使用.

- 数据反转

  ```javascript
  return [unNormXs.dataSync(), unNormPreds.dataSync()];
  ```

  将(0-1)的数据回到原始范围, 将数据根据归一化时的计算, 反转结果.

### 2.8 