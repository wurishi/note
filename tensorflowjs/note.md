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

训练模型根据一组汽车的数值数据进行预测.

因为要训练一个模型来预测连续数, 所以有时将此任务称为回归 (regression)任务. 

通过显示许多输入示例以及正确的输出来训练模型, 这被称为监督学习 (supervised learning)

### 2.2 设置

一个模板 index.html 文件, 和一个 script.js 用来 code.

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

### 2.8 总结

训练机器学习模型的步骤包括:

#### 制定任务:

- 确定是回归问题还是分类问题?
- 可以通过有监督的学习还是无监督的学习来完成?
- 输入数据是什么样的? 输出的数据应该是什么样的?

#### 准备数据:

- 清理数据并在可能的情况下手动检查其是否有图形.
- 将数据用于训练之前要先 shuffle.
- 将数据标准化(归一化)到神经网络的合理范围内. 通常是 0~1 或者是 -1~1 范围.
- 将数据转换为张量.

#### 构建并运行模型:

- 定义模型.
- 选择一个优化器.
- 为问题选择适当的损失函数, 并选择一个准确度指标来评估进度.
- 查看训练进程中损失是否正在减少.

#### 评估模型:

- 为模型选择一个评估指标, 在训练过程中对其进行监控. 进行训练后, 尝试进行一些测试, 提高预测质量.

### 2.9 额外的尝试

- 尝试修改迭代的次数 (epochs).

- 尝试增加隐藏层中的单位数量.

- 尝试在第一个隐藏层和最终输出层之间添加更多的隐藏层.

  ```javascript
  model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
  ```

## 3. 识别手写数字

[代码](3/index.html)

### 3.1 介绍

通过分类器 "观察" 数千个手写数字图像及其标签来训练分类器. 然后使用模型从未见过的测试数据来评估分类器的准确性.

该任务被视为分类任务, 因为我们正在训练模型以将出现在图像中的数字分配给输入图像.

通过显示许多输入示例以及正确的输出来训练模型, 这被称为监督学习.

### 3.2 设置

### 3.3 加载数据

### 3.4 构思任务

目标是训练一个拍摄一张图像的模型, 并学习预测该图像可能属于的数字 (数字 0~9)

每个图像宽28像素, 高28像素, 并具有1个颜色通道 (因为它是灰度图像). 因此, 每个图像的形状为 [28, 28, 1].

### 3.5 定义模型架构

损失函数: categoricalCrossentropy, 因为这里的模型输出的是概率分布, categoricalCrossentropy 会测量模型最后一层生成的概率分布与真实标签给出的概率分布之间的误差.

比如数字7, 可能会得到以下结果:

| 图片 | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7        | 8    | 9    |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | -------- | ---- | ---- |
| 标签 | 0    | 0    | 0    | 0    | 0    | 0    | 0    | **1**    | 0    | 0    |
| 预测 | 0.1  | 0.01 | 0.01 | 0.01 | 0.20 | 0.01 | 0.01 | **0.60** | 0.03 | 0.02 |

这里用于标签的数据被称为 **one-hot encoding** , 在分类问题中很常见. 对于每个示例, 每个类别都有与之关联的概率. 当我们确切知道应该是什么时, 就可以将该概率设置1, 其它概率都设置为0.

### 3.6 训练模型

### 3.7 评估模型

### 3.8 总结

预测输入数据的类别称为分类任务.

#### 分类任务要求标签具有适当的数据形式

- 标签数据 one-hot encoding 是常见的形式.

#### 准备数据

- 组织一些训练期间未参与的数据作为评估模型时使用, 这组数据称为验证集.

#### 构建并运行模型

- 卷积模型在图像任务上表现良好.
- 分类问题通常使用 categoricalCrossentropy 作为损失函数.
- 监视训练以查看损失是否在减少并且准确性是否在增加.

#### 评估模型

- 一旦训练了模型以决定要解决的初始问题的性能如何, 就可以决定评估模型的方式.
- 观察每组数据的准确性和混淆矩阵可以提供比整体准确性更好的模型性能分析.

## 4. 在 Node.js 中预测棒球投球类型

### 4.1 介绍

使用 TensorFlow.js 构建 Node.js Web服务器, 在服务器端进行训练和分类, 并在 Web 客户端调用预测.

### 4.2 要求

### 4.3 安装 Node.js 应用

### 4.4 设置训练和测试数据

### 4.5 创建模型

### 4.6 在服务器上训练模型

### 4.7 客户端

### 4.8 运行应用

需要将 client 和 server 都运行.

## 5. 什么是迁移学习

复杂的深度学习模型通常有数百万的参数 (weights), 从头训练模型需要大量计算资源. 迁移学习就是指将已经在相关任务中训练过的模型的一部分利用到新模型中, 从而很大程度地降低对大量计算资源的需要.

## 6. 图像分类迁移学习

### 6.1 介绍

### 6.2 要求

### 6.3 加载 MobileNet 模型

### 6.4 使用 MobileNet 在浏览器中预测

### 6.5  在浏览器中测试 MobileNet

模型怎样下载到本地?

### 6.6 在浏览器中通过摄像头图像运行 MobileNet 预测

### 6.7 在 MobileNet 上添加自定义分类器

## 7. 语音识别的迁移学习

### 7.1 介绍

首先, 加载并运行一个可识别20条语音命令的预训练模型. 然后, 使用麦克风建立并训练一个简单的模型来识别声音并使滑块向左或向右移动.

### 7.2 要求

### 7.3 加载音频模型

### 7.4 实时预测

### 7.5 测试预测

### 7.6 收集数据

### 7.7 测试数据收集

### 7.8 训练模型

### 7.9 实时更新滑块

# 二. 指南

## 1. 张量 (Tensors) 和操作 (operations)

### 1.1 张量 (Tensors)

[代码](guide/1.1.js)

`tf.Tensor` 是 TensorFlow.js 中的最重要的数据单元, 它是一个形状为一维或多维数组组成的数值的集合.

`tf.Tensor` 和多维数组其实非常的相似.

一个 `tf.Tensor` 还包含如下属性:

- rank: 张量的维度
- shape: 每个维度的数据大小
- dtype: 张量中的数据类型

> 注释: 后面也会用术语"维度 (dimension)"表示 rank (秩). 在机器学习中, 张量的"维数 (dimensionality)"有时也指特定维度的大小.
>
> 例如: 一个形状为 [10, 5] 的矩阵是一个 rank-2 的张量, 或者可以说成一个 2- 维的张量. 第一个维度的维数是10.

可以用 `tf.tensor()` 方法将一个数组(array)创建为一个 `tf.Tensor` 

在默认情况下, `tf.Tensor` 的数据类型是 `dtype` 即32位浮点型(`float32`). 当然 `tf.Tensor` 也可以被创建为以下数据类型: 布尔(`bool`), 32位整型(`int32`), 64位复数(`complex64`)和字符串(`string`).

TensorFlow.js 同样也提供了一系列方便的模式用作创建随机张量, 比如将张量填入特定的数值或是从 `HTMLImageElement` 中获取张量.

#### 修改张量的形状

`tf.Tensor` 中的元素数量是这个张量的形状的乘积(例如一个形状为[2,3]的张量所含有的元素个数为2*3=6个). 所以在大部分情况下不同形状的张量的大小却是相同的, 那么将一个 `tf.Tensor` 改变形状(reshape)成为另外一个形状通常是有用且有效的.

#### 获取张量的值

如果想要获取一个 `tf.Tensor` 的值, 可以使用 `Tensor.array()` 或 `Tensor.data()` 这两个方法.

> Tensor.array() 和 Tensor.data() 都是异步方法, 它们也有对应的同步执行版本, Tensor.arraySync() 和 Tensor.dataSync()

### 1.2 操作

[代码](guide/1.2.js)

因为张量是不可变的, 所以所有操作运算并不会更改 Tensor 本身的值, 而是返回一个新的 `tf.Tensor`

> 注释: 大部分的操作会同步返回 tf.Tensor , 然而结果可能不会立刻被计算出来. 这意味着得到的 tf.Tensor 实际上是计算的一个句柄. 当调用 Tensor.data() 或 Tensor.array() 时, 这些方法将会等待计算完成之后才将数值解析出来. 所以应该始终优先选择这些方法的异步版本而不是同步版本, 以避免计算过程中阻塞 UI 线程.

### 1.3 内存

[代码](guide/1.3.js)

当使用 WebGL 时, `tf.Tensor` 的内存必须显式管理. 这是因为 WebGL 不足以让 `tf.Tensor` 超出生命周期后自动释放内存.

- tf.tidy() : 一个应用程序中, 将多个操作链接在一起是非常常见的. 保存所有中间变量的引用并手动释放它们所占用的空间会降低代码的可读性. 为了解决这个问题, 可以使用 `tf.dity()` 方法, 这个方法可以清除所有在执行函数后没有返回的 tf.Tensor, 这和执行函数时清除一些局部变量的方法有些类似.
- tf.memory() : 获取 TensorFlow.js 中张量的数量.

## 2. 平台和环境

TensorFlow.js 有两种工作平台: 浏览器和Node.js. 不同平台有很多不同的配置, 平台间的差异影响着基于平台的应用开发.

在浏览器平台上, TensorFlow.js 既支持移动设备, 也支持台式设备. 虽然设备之间有很多差异, TensorFlow.js 提供的 WebGL API 能够自动检测检测并做相应的优化配置.

在 Node.js 平台上, TensorFlow.js 既支持直接使用 TensorFlow API, 也支持更慢的 CPU 环境.

### 2.1 环境

当一个用 TensorFlow.js 开发的程序运行时, 所有的配置被统称为环境. 它包含一个全局的 backend, 以及一些可以精确控制 TensorFlow.js 特性的标记.

#### 2.1.1 Backends

TensorFlow.js 支持多个不同的 backend, 用来实现张量的存储和数学操作. 任何时候都只有一个 backend 生效. 大部分时间, TensorFlow.js 会根据当前环境自动选择使用最佳的 backend. 即使这样, 仍然需要知道, 如何得知当前正在使用的是哪个 backend, 以及如何在不同的 backend 之间切换.

1. WebGL backend

   WebGL backend, 简称 "webgl", 是在浏览器平台上最强大的一个 backend. 它比 CPU backend 要快100倍. 部分原因是, Tensor 是作为 WebGL 纹理保存的, 数学运算操作实现在 WebGL shader 里面.

   使用这个 backend 是需要了解的一些知识:

   - 避免阻塞 UI 线程 : 当调用一个操作, 如 `tf.matMul(a,b)` 时, 返回值 `tf.Tensor` 会同步返回, 然而这时矩阵乘法运算还不一定完成. 这意味着返回值 `tf.Tensor` 只是一个指向运算的句柄. 当调用 `x.data()` 或 `x.array()` 时, 只有当运算完成时才能取到实际值. 因此在运算过程中, 为避免阻塞 UI 线程, 需要使用异步版本的 `x.data()` 和 `x.array()`, 而不是同步版本.

   - 内存管理 : 在使用 WebGL backend 时, 需要显式管理内存. 因为存储 Tensor 的 WebGL 纹理, 不会被浏览器的垃圾收集机制自动清理. 所以要使用 tf.dispose() 和 tf.tidy() 方法. 

     > 注意: 其他非 WebGL 环境有自动垃圾回收机制, 在这些环境下使用 dispose() 或 tidy() 没有副作用. 实际上, 主动调用通常会比垃圾回收的清理带来更好的性能.

   - 精度 : 在移动设备, WebGL 只支持16位浮点纹理操作. 然而, 大部分机器学习模型都用32位浮点的 weight 和 activation 训练的. 由于16位浮点数字只能表示[0.000000059605, 65504]这个范围, 当把模型移植到移动设备时, 它会产生精度问题. 你需要保证自己模型中的 weight 和 activation 不要超出这个范围.

   - 编译 Shader 和 texture 上传 : TensorFlow.js 在 GPU 里执行 WebGL 的 shader 程序. 然而这些 shader 只有在被调用时才会被编译, 即 lazy-compile. 编译过程在 CPU 上的主线程完成, 这导致程序变慢. TensorFlow.js 会自动缓存编译好的 shader, 下次再调用有同样 shape, 同样输入输出的 tensor 时能快很多.

     TensorFlow.js 还会把 tf.Tensor 数据存储为 WebGL 纹理. 当一个 tf.Tensor 被创建后, 不会立即上传到 GPU, 而是当其被用到时才这么做. 如果这个 tf.Tensor 被第二次使用时, 由于已经在 GPU 里, 因此省掉了上传开销. 这意味着在一个典型的机器学习模型中, weight 在第一次预测时被上传, 第二次就会快很多.

     如果希望加快第一次预测的性能, 可以对模型进行预热, 即传递一个有同样 shape 的输入 Tensor. 如:

     ```javascript
     const model = await tf.loadLayersModel(modelUrl);
     // 使用真实数据来预热模型
     const warmupResult = model.predict(tf.zeros(inputShape));
     warmupResult.dataSync();
     warmupResult.dispose();
     
     // 第二次执行 predict() 的时候将会更加快速
     const result = model.predict(userData);
     ```

2. Node.js TensorFlow backend

   在 Node.js TensorFlow backend 中, 所谓 "node", 即 TensorFlow 的 C 语言 API 被用来加速操作. 它会尽可能使用机器的硬件加速模块, 如 CUDA.

   在这个 backend 中, 和 WebGL backend 一样, 函数会同步返回 `tf.Tensor`. 然而, 与 WebGL backend 不同的是, 当你获得这个 tensor 返回值时, 运算已经完成. 这意味着 `tf.matMul(a,b)` 调用会阻塞 UI 线程.

   因此, 如果在生产环境下使用这个方法, 需要在工作线程中调用, 而不是主线程.

3. CPU backend

   这个 backend 是性能最差的 backend, 然而是最简单的. 所有操作都实现在 vanilla JavaScript 中, 因此很少有并行化, 并且会阻塞 UI 线程.

   这个 backend 对测试有用, 或者是用于 WebGL 不能使用的设备.

#### 2.1.2 Flags

TensorFlow.js 有一套环境标记, 能够自动评估和检测, 保证是当前平台上的最佳配置. 这些标记大部分是内部使用, 其中有一些全局标记可以被 API 控制.

- tf.enableProdMode() : 启用生产模式. 它会去掉模型验证, NaN检查, 以及其他错误校验操作, 从而提高性能.
- tf.enableDebugMode() : 启动调试模式. 它会记录每种操作的日志并输出到调试台, 还记录运行性能信息, 如内存 footprint 和内核执行时间. 注意, 这将极大降低应用运行时间, 不可在生产环境中使用.

> 注1: 这两种方法应该在程序的最前面调用, 因为它们影响所有的其他标记. 基于同样的原因, 没有相应的 disable 方法.
>
> 注2: 所有标记在控制台都记录为 tf.ENV.features. 尽管没有对应的公开API (不需要考虑版本兼容), 你可以使用 tf.ENV.set 来改变这些标记, 从而对程序做微调或诊断.

## 3. 模型和图层

机器学习中, 一个 model 是一个带有可训练参数的函数. 这个函数将输入转化为输出. 通俗的来说, 这个函数表达了输入和输出之间的变换关系. 通过在数据集上训练模型来获得最佳参数. 训练好的模型可以精确的将输入数据转换为我们想得到的输出.

TensorFlow.js 有两种创建机器学习的方法:

1. 用 Layers API (用 layers 来创建模型)
2. 用 Core API (底端算子, 例如: `tf.matMul()` 或 `tf.add()` 等)来建立模型

### 3.1 用 Layers API 创建模型

[代码](guide/3.1.js)

Layers API 有两种方式创建模型: 第一种是创建 sequential 模型, 第二种是创建 functional 模型.

#### 使用 sequential model

最常见的模型是 Sequential 模型. 该模型将网络的每一层简单的叠在一起.

- 使用 `sequential()` 函数
- 使用 `add()` 方法

> 注意: 模型的第一层需要"输入形状"参数 (inputShape). 不要在"输入形状"中包含 batch size (批次大小). 假设要向模型输入一个形状为 [B, 784] 的张量 (B 是任意 batch size), 输入形状要设为 [784].

可以通过 `model.layers` 来使用模型中的每一层. 也可以使用 `model.inputLayers` 和 `model.outputLayers` 来调用输入层和输出层.

#### 使用 functional model

可以通过 `tf.model()` 来创建 `LayersModel`. `tf.model()` 和 `tf.sequential()` 的主要区别为, 可以用 `tf.model()` 来创建任何非闭环的计算图.

### 3.2 验证

`sequential model` 和 `functional model` 都属于 `LayersModel` 类. 使用 `LayersModels` 让验证更方便: 它要求您定义输入形状, 并用定义的形状来验证对模型的输入. `LayersModel` 会自动计算模型中所有张量的形状. 知道张量的形状后, 模型就可以自动创建它所需要的参数, 可以用形状信息来判断两层相邻的层是否相互兼容.

### 3.3 模型总览

使用 `model.summary()` 可以显示很多模型的重要信息.

- 每一层的名字和类型
- 每一层的输出形状
- 每一层的权重数量
- 每一层的输入
- 一个模型拥有的可训练参数总量, 和不可训练参数总量

### 3.4 序列化

相对于底端 API 而言, 使用 `LayersModel` 的另一个好处是方便存储, 加载模型. `LayersModel` 包含如下信息:

- 可用于重建模型的模型架构信息
- 模型的权重
- 训练配置 (例如损失函数, 优化器的评估方式)
- 优化器的状态 (可用于继续训练模型)

存储和加载模型只需要一行代码:

```javascript
const saveResult = await model.save('localstorage://my-model-1');
const model = await tf.loadLayersModel('localstorage://my-model-1');
```

模型还能保存在不同的媒介中 (如: file storage, IndexedDB, 触发下载到浏览器等等)

### 3.5 自定义层

层是创建模型的基础. 如果模型需要定制化计算模块, 可以写一个自定义层并插入模型中.

计算平方和的自定义层:

[代码](guide/3.5.js)

> 注意: 模型中包含了自定义层, 模型将不能序列化.

### 3.6 用 Core API 创建模型

Layers API 是最常用的建立模型的方式, 因为它的模式是基于广泛应用的 Keras API. Layers API 提供了大量方便的工具, 例如权重初始化, 模型序列化, 训练监测, 可迁移性和安全检查.

当遇到如下情况时, 可能会需要使用 Core API:

- 需要更多灵活性和控制
- 不需要序列化或可以创造自己的序列化方法

用 Core API 写的模型包含了一系列的函数. 这些函数以一个或多个张量作为输入, 并输出另一个张量.

[代码](guide/3.6.js)

## 4. 训练模型

在 TensorFlow.js 中, 有两种方法来训练机器学习模型:

1. 使用 Layers API 中的`LayersModel.fit()` 或`LayersModel.fitDataset()`.
2. 使用 Core API 中的 `Optimizer.minimize()`.

### 4.1 介绍

训练模型的步骤:

- 获取一**批**对应模型的数据.
- 用模型作出预测.
- 比较预测和真实结果.
- 确定每个参数的变化量以便让模型下次预测时更准确.

好的模型将通过输入数据预测出精确的输出结果.

### 4.2 模型参数

> 注意: 默认情况下 `dense layer` 包含了偏差(bias), 可以通过参数 {useBias: false} 来创建不包含偏差的 `dense layer`

### 4.3 优化器, 损失和指标

在进行任何培训之前, 需要确定三件事:

1. 优化器

   在给定当前模型预测的情况下, 优化器的工作是决定更改模型中每个参数的数量. 使用 Layers API时, 可以使用 'sgd' 或 'adam', 也可以提供 `Optimizer` 类的自定义实现.

2. 损失函数

   模型的目的是尝试最小化. 其目标是给模型预测的错误程度给出一个数字, 让模型可以更新其权重. 使用 Layers API 时, 可以使用 'categoricalCrossentropy', 也可以提供接收预测值和真实值并返回损失的自定义函数.

3. 指标列表

   和损失函数类似, 指标会计算出一个数字, 用来总结模型的运行情况. 通常在每个时期结束时对整个数据计算指标. 这样可以监视损失是否随着时间推移而下降. 但通常更常用的指标需要更人性化, 例如准确性. 使用 Layers API 时, 可以使用 'accuracy', 也可以提供接收预测值和真实值并返回分数的自定义函数.

### 4.4 训练

有两种方式训练 LayersModel:

1. 使用 `model.fit()` 并提供数据.
2. `model.fitDataset()` 通过 `Dataset` 对象使用和提供数据.

#### model.fit()

如果数据集全都在内存中, 并且作为单个张量使用时, 则可以通过调用fit()的方法来训练模型.

model.fit() 在幕后做了很多事情:

- 将数据分为训练和验证集, 并使用验证集来衡量训练期间的进度.
- 仅在拆分后才对数据进行随机排序. 为了安全起见, 应该在将数据传递给 model 之前先进行预洗数据.
- 将大数据张量拆分为大小较小的张量 `batchSize`.
- `optimizer.minimize()` 在计算有关数据批次的模型损失时调用.
- 可以在每个批次的开始和结束时通知外部, 即在 `callbacks` 中, 包括: `onTrainBegin`, `onTrainEnd`, `onEpochBegin`, `onEpochEnd`, `onBatchBegin` 和 `onBatchEnd`.
- 它会在主线程上运行, 以确保可以及时处理 JS 事件队列中的任务.

#### model.fitDataset()

如果数据不能完全放在内存中或使用的是流式传输, 则可以通过调用 `fitDataset()` 和使用 `Dataset` 对象来训练模型.

### 4.5 预测新数据

训练完模型后, 调用 model.predict() 对之前模型未观察过的数据进行预测.

### 4.6 Core API

使用 Core API 训练模型的标准方式:

- 循环 epochs 次数.
- 在每个 epoch 内, 循环遍历批次数据. 使用 `Dataset` 的 `forEachAsync()` 是一种方便的循环批处理的方法.
- 对于每个批次, 调用 `optimizer.minimize(f)` 根据之前的定义计算出结果并执行 `f`.
- 用 `f` 计算损失, 分析模型的预测和真实值之间的损失.

## 5. 保存并加载 tf.Model

TensorFlow.js 提供了保存和加载模型的功能, 这些模型可以是使用 Layers API 创建的或从现有 TensorFlow 模型转换来的. 可能是自己训练过的模型, 也可能是别人训练的模型. 使用 Layers API 的一个主要好处是使用它创建的模型是可序列化的.

### 5.1 保存 tf.Model

`tf.Model` 和 `tf.Sequential` 同时提供了函数 `model.save` 用来保存一个模型的*拓扑结构* (topology) 和 *权重* (weights)

- 拓扑结构: 是一个描述模型结构的文件 (例如它使用了哪些操作). 它包含了对存储在外部的模型权重的引用.
- 权重: 是以有效格式存储给定模型权重的二进制文件. 它们通常存储在与拓扑结构相同的文件夹中.

```javascript
const saveReulst = await model.save('localstorage://my-model-1');
```

一些需要注意的地方:

- save 方法采用 scheme 字符串开头的类似 URL 字符串参数. 它描述了想保存模型的地址类型.
- 在 scheme 之后是路径(path).
- `save` 方法是异步的.
- `model.save` 返回值是一个 JSON 对象, 它包含一些可能有用的信息, 例如模型的拓扑结构和权重的大小.
- 用于保存模型的环境不会影响那些可以加载模型的环境. 在 node.js 中保存模型时并不会阻碍模型在浏览器中被加载.

#### 本地存储 (仅限浏览器)

```javascript
await model.save('localstorage://my-model');
```

可以在浏览器的本地存储中以名称 my-model 来保存模型. 这样存储能够在浏览器刷新后保持不变. 当存储空间成为问题时, 用户或浏览器本身可以清除本地存储. 每个浏览器还可以对给定域在本地的存储空间设定限额.

#### IndexedDB (仅限浏览器)

```javascript
await model.save('indexeddb://my-model');
```

会将模型保存到浏览器的 IndexedDB 存储中. 与本地存储一样, 它在刷新后仍然存在, 同时它往往也对存储的对象的大小有限制.

#### 文件下载 (仅限浏览器)

```javascript
await model.save('downloads://my-model');
```

会让浏览器下载模型文件到用户的机器上, 并生成两个文件:

- 一个名为 `[my-model].json` 的 JSON 文件, 它包含了模型的拓扑结构和权重文件的引用.
- 一个二进制文件, 其中包含名为 `[my-model].weights.bin` 的权重值.

> 由于 .json 使用相对路径指向 .bin, 所以两个文件需要被安放在同一个文件夹中.
>
> 某些浏览器要求用户在同时下载多个文件之前授予权限.

#### HTTP(S) Request

```javascript
await model.save('http://model-server.domain/upload');
```

这将创建一个 Web 请求, 以将模型保存到远程服务器. 模型将通过 POST 请求发送到指定的 HTTP 服务器. POST 请求的 body 遵守称为 `multipart/form-data` 的格式. 它由以下两个文件组成:

1. 一个名为 model.json 的 JSON 文件, 其中包含拓扑结构和对权重文件的引用.
2. 一个二进制文件, 其中包含名为 [my-model].weights.bin 的权重值.

#### 本机文件系统 (仅限于 Node.js)

```javascript
await model.save('file:///path/to/my-model');
```

当运行 Node.js 后可以直接访问文件系统并且保存模型. 这个命令将会保存两个文件在 scheme 之后指定的 path 中.

1. 一个名为 model.json 的 JSON 文件, 其中包含拓扑结构和权重文件的引用.
2. 一个二进制文件, 其中包含名为 model.weights.bin 的权重值.

### 5.2 加载 tf.Model

```javascript
const model = await tf.loadLayersModel('localstorage://my-model-1');
```

- 类似于 `model.save()` , `loadLayersModel` 函数使用以 scheme 开头的类似 URL 的字符串参数. 它描述了加载模型的目标类型.
- scheme 由path指定.
- URL 字符串可以被替换为一个符合 IOHandler 接口的对象.
- `tf.loadLayersModel()` 函数是异步的.
- `tf.loadLayersModel` 返回的值是 `tf.Model`.

#### 本地存储 (仅限浏览器)

```javascript
const model = await tf.loadLayersModel('localstorage://my-model');
```

#### IndexedDB (仅限浏览器)

```javascript
const model = await tf.loadLayersModel('indexeddb://my-model');
```

#### HTTP(S)

```javascript
const model = await tf.loadLayersModel('http://model-server.domain/download/model.json');
```

将从 HTTP 加载模型, 加载 json 文件后, 会请求对应的 json 文件引用的 .bin 文件.

> 注意: 这个工具依赖于 fetch 方法. 如果环境没有提供原生的 fetch 方法, 可以提供全局方法名称 fetch 来满足接口需求, 或是使用类似于 (node-fetch) 的库.

#### 本机文件系统 (仅限于 Node.js)

```javascript
const model = await tf.loadLayersModel('file://path/to/my-model/model.json');
```

当运行在 Node.js 上时, 可以直接访问文件系统并加载模型. 注意, 加载时调用的是 model.json 文件本身 (保存时, 指定的是一个文件夹). 相应的 .bin 文件需要和 json 文件在同一个文件夹中.

#### 使用 IOHandlers 加载模型

可以使用 `IOHandler` 执行自定义的加载行为. Tensorflow.js 的 `IOHandler` 提供了 `tf.io.browserFiles`, 运行浏览器用户在浏览器中上传文件.

### 5.3 使用自定义的 IOHandlers 保存或加载模型

- `IOHandler` 是一个含有 `save` 和 `load` 方法的对象.
- `save` 函数接受一个与 `ModelArtifacts` 接口匹配的参数并且会返回一个解析为 `SaveResult` 的对象.
- `load` 函数没有接受参数, 需要返回一个解析为 `ModelArtifacts` 的对象. 这和传递给 `save` 的对象相同.

## 6. 模型转换

TensorFlow.js 配备了各种预训练模型, 这些模型可以在浏览器中使用, [模型仓库](https://github.com/tensorflow/tfjs-models)中有相关介绍. 但也可能已经在其他地方找到或创建了一个 Tensorflow 模型, 并希望在 Web 应用程序中使用该模型. 因此, Tensorflow.js 提供了一个模型转换器, 它包含了两个组件:

1. 一个命令行程序, 用于转换 Keras 和 TensorFlow 模型以在 TensorFlow.js 中使用.
2. 一个 API, 用于在浏览器中使用 TensorFlow.js 加载和执行模型.

### 6.1 转换模型

Tensorflow.js 转换器可以转换以下几种模型的模型:

- SavedModel: 保存 Tensorflow 模型的默认格式.
- Keras model: Keras 模型通常保存为 HDF5 文件.
- TensorFlow Hub module: 这些是打包后在 TensorFlow Hub 中进行分发的模型, TensorFlow Hub 是一个共享和发现模型的平台.

```shell
tensorflowjs_converter --input_format=keras /tmp/model.h5 /tmp/tfjs_model
```

这会将路径为 /tmp/model.h5 的模型转换并输出 model.json 文件及其二进制权重文件到目录 /tmp/tfjs_model/中.

### 6.2 运行模型

成功转换模型之后, 将得到一组权重文件和一个模型拓扑文件.

加载转换后的 Tensorflow SavedModel 或 TensorFlow Hub 模块的 API:

```javascript
const model = await tf.loadGraphModel('path/to/model.json');
```

转换后的 Keras 模型的 API:

```javascript
const model = await tf.loadLayersModel('path/to/model.json');
```

`tf.loadGraphModel` API 返回 `tf.FrozenModel`, 意味着各项参数是固定的并且不能使用新数据对模型进行微调.

`tf.loadLayersModel` API 返回可训练的 `tf.Model`.

## 7. Node 中的 TensorFlow.js

### 7.1 TensorFlow CPU

```javascript
import * as tf from '@tensorflow/tfjs-node';
```

当从这个包导入 Tensorflow.js 时, 导入的模型将由 Tensorflow C 二进制文件加速并在 CPU 上运行. CPU 上的 Tensorflow 使用硬件加速来加速内部的线性代数运算.

### 7.2 TensorFlow GPU

```javascript
import * as tf from '@tensorflow/tfjs-node-gpu';
```

与 CPU 包一样, 导入的模块将由 Tensorflow C 二进制文件加速, 但是将使用 CUDA 在 GPU 上运行张量运算, 因此只能运行在 Linux 平台. 该绑定比其他可选绑定可以快至少一个数量级.

### 7.3 普通 CPU

```javascript
import * as tf from '@tensorflow/tfjs';
```

这个包与浏览器中使用的包类似. 在这个包中, 是在 CPU 上以原生 Javascript 运行的. 这个包比其他包小得多, 因为它不需要 Tensorflow 二进制文件, 但是速度要慢得多.

### 7.4 生产环境考虑因素

Node.js Bindings 为 Tensorflow.js 提供了一个同步地执行操作的后端. 这意味着当调用一个操作时, 例如 `tf.matMul(a,b)`, 它将阻塞主线程直到这个操作完成.

因此, 当前这种 Bindings 非常适合脚本和离线任务. 如果要在实际应用程序(如: Web 服务器) 中使用 Node.js Bindings, 则应设置一个工作队列或设置一些工作线程, 以便使得 Tensorflow.js 代码不会阻塞主线程.

### 7.5 APIs

一旦使用上述任意选项将包导入为 tf 后, 所有常规的 Tensorflow.js 符号都将出现在导入的模块上.

#### tf.browser

在普通的 Tensorflow.js 包中, tf.browser.* 命名空间中的符号在 Node.js 中不可用, 因为它们使用特定浏览器的 API.

目前, 有如下 API:

- tf.browser.fromPixels
- tf.browser.toPixels

#### tf.node

tf.node 在 node.js 下包含特定 Node 的 API.

TensorBoard 是一个特定 Node.js API

```javascript
await model.fit(xs, ys, {
    epochs: 100,
    validationData: [valXs, valYs],
    callbacks: tf.node.tensorBoard('/tmp/fit_logs_1')
});
```

# 三. Demo

## 1. 身体分割 (BodyPix)

[代码](demos/bodypix/index.js)

## 2. 姿势估计 (PoseNet)

[代码](demos/posenet/index.js)

## 3. 图像分类 (MobileNet)

[代码](demos/mobilenet/index.js)

## 4. 对象检测 (Coco SSD)

[代码](demos/cocossd/index.js)

## 5. 文本恶意检测 (Toxicity)

[代码](demos/toxicity/index.js)

## 6. 通用语句编码器 (Universal Sentence Encoder)

[代码](demos/u-s-e/index.js)

## 7. 语音指令识别 (Speech Commands)

[代码](demos/speech-commands/index.html)

## 8. KNN 分类器 (KNN)

[代码](demos/knn/index.js)

## 9. 简单的人脸检测 (Blazeface)

[代码](demos/blazeface/index.js)

## 10. 语义分割 (DeepLab)

目前版本由于数据类型不匹配而报错

## 11. 人脸标识检测 (facemesh)

[代码](demos/facemesh/index.js)

## 12. 手势标识检测 (handpose)

[代码](demo/handpose/index.js)