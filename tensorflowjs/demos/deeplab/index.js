import * as tf from "@tensorflow/tfjs";
import * as tfconv from "@tensorflow/tfjs-converter";
import * as deeplab from "@tensorflow-models/deeplab";

async function loadModel(modelName = "pascal", quantizationBytes = 2) {
  // const model = await deeplab.load({ base: modelName, quantizationBytes });
  // 方法一:
  const url = `../model/${modelName}/${quantizationBytes}/model.json`;
  const model = await deeplab.load({
    modelUrl: url,
    base: modelName,
    quantizationBytes,
  });
  return model;

  // 方法二:
  // const rawModel = await tfconv.loadGraphModel(url);
  // return new deeplab.SemanticSegmentation(rawModel);
}

let modelName = "pascal";
let quantizationBytes = 2;

const modelEL = document.createElement("select");
["pascal", "cityscapes", "ade20k"].forEach((v) => {
  const option = document.createElement("option");
  option.label = v;
  option.value = v;
  modelEL.appendChild(option);
});
modelEL.value = modelName;
document.body.appendChild(modelEL);
modelEL.onchange = () => (modelName = modelEL.value);

const qEL = document.createElement("select");
[1, 2, 4].forEach((v) => {
  const option = document.createElement("option");
  option.label = v;
  option.value = v;
  qEL.appendChild(option);
});
qEL.value = quantizationBytes;
document.body.appendChild(qEL);
qEL.onchange = () => (quantizationBytes = +qEL.value);

const button = document.createElement("button");
button.textContent = "加载";
document.body.appendChild(button);
button.onclick = () => {
  run();
};

async function run() {
  const model = await loadModel(modelName, quantizationBytes);
  // console.log(model);

  const colormap = deeplab.getColormap(modelName);
  const labels = deeplab.getLabels(modelName);
  // console.log(colormap);
  // console.log(labels);

  const img = await imgP("../img.jpg");
  // document.body.appendChild(img);
  let canvas = document.getElementById("output");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "output";
    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);
  }

  const tmp = await model.predict(img);
  // console.log(tmp);

  const classify = await model.segment(img, {
    canvas,
  });
  console.log(classify);
}

function imgP(url) {
  return new Promise((r) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      r(image);
    };
  });
}
