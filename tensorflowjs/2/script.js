// console.log(tf, tfvis);

// 加载数据, 尽量本地执行, 所以将carData数据下载直接放到data.js中
async function getData() {
  //   const carsDataReq = await fetch(
  //     "https://storage.googleapis.com/tfjs-tutorials/carsData.json"
  //   );
  const carsData = window.data.carsData;
  const cleaned = carsData
    .map((car) => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }))
    .filter((car) => car.mpg != null && car.horsepower != null);

  return cleaned;
}

async function run() {
  const data = await getData();
  const values = data.map((d) => ({
    x: d.horsepower,
    y: d.mpg,
  }));

  // 使用 tfvis 根据数据绘制散点图
  tfvis.render.scatterplot(
    { name: "Horsepower v MPG" },
    { values },
    {
      xLabel: "Horsepower",
      yLabel: "MPG",
      height: 300,
    }
  );

  // 创建一个模型实例
  const model = createModel();
  tfvis.show.modelSummary({ name: "Model Summary" }, model);

  // 转换数据
  const tensorData = convertToTensor(data);
  const { inputs, labels } = tensorData;

  // 训练模型
  await trainModel(model, inputs, labels);
  console.log("训练完成");

  // 作出预测
  testModel(model, data, tensorData);
}

document.addEventListener("DOMContentLoaded", run);

function createModel() {
  // 创建一个模型
  const model = tf.sequential();

  // 添加一个输入图层
  model.add(
    tf.layers.dense({
      inputShape: [1],
      units: 1,
      useBias: true,
    })
  );

  // 添加一个输出图层
  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true,
    })
  );

  return model;
}

// 将数据转换成张量数据
function convertToTensor(data) {
  return tf.tidy(() => {
    // step1 Shuffle the data
    tf.util.shuffle(data);

    // step2 convert data to tensor
    const inputs = data.map((d) => d.horsepower);
    const labels = data.map((d) => d.mpg);

    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    // step3 normalize the data to the range 0 - 1
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

// 训练模型
async function trainModel(model, inputs, labels) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });

  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: "Training Performance" },
      ["loss", "mse"],
      { height: 200, callbacks: ["onEpochEnd"] }
    ),
  });
}

// 作出预测
function testModel(model, inputData, normalizationData) {
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));

    const unNormXs = xs
      .mul(inputMax.sub(inputMin)) //
      .add(inputMin);

    const unNormPreds = preds //
      .mul(labelMax.sub(labelMin))
      .add(labelMin);

    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  const predictedPoints = Array.from(xs).map((val, i) => ({
    x: val,
    y: preds[i],
  }));

  const originalPoints = inputData.map((d) => ({
    x: d.horsepower,
    y: d.mpg,
  }));

  tfvis.render.scatterplot(
    { name: "Model Predictions vs Original Data" },
    {
      values: [originalPoints, predictedPoints],
      series: ["original", "predicted"],
    },
    {
      xLabel: "Horsepower",
      yLabel: "MPG",
      height: 300,
    }
  );
}
