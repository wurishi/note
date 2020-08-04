import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

const videoEl = document.createElement("video");
videoEl.muted = true;
videoEl.autoplay = true;
videoEl.width = 300;
videoEl.height = 300;
document.body.appendChild(videoEl);

async function run() {
  const model = await mobilenet.load({
    version: 1,
    alpha: 0.25,
  });
  // const model = await mobilenet.load({
  //   modelUrl: "../model/100/model.json",
  //   version: 1,
  // });

  const webCam = await tf.data.webcam(videoEl);

  while (true) {
    const img = await webCam.capture();
    const predictions = await model.classify(img, 3);
    output(predictions);
    img.dispose();
    await tf.nextFrame();
  }
}

const resultEl = document.createElement("div");
document.body.appendChild(resultEl);

const predictionResult = {};
function output(predictions) {
  const keys = Object.keys(predictionResult);
  keys.forEach((key) => {
    predictionResult[key][0].value = 0;
    predictionResult[key][1].textContent = "0";
  });
  predictions.forEach((item) => {
    if (!predictionResult[item.className]) {
      const span = document.createElement("span");
      span.textContent = item.className;
      const range = document.createElement("input");
      range.type = "range";
      range.min = 0;
      range.max = 1;
      range.step = 0.01;
      range.value = 0;
      const vspan = document.createElement("span");
      const div = document.createElement("div");
      div.appendChild(span);
      div.appendChild(range);
      div.appendChild(vspan);
      resultEl.appendChild(div);

      predictionResult[item.className] = [range, vspan];
    }
    predictionResult[item.className][0].value = item.probability;
    predictionResult[item.className][1].textContent = item.probability.toFixed(5);
  });
}

run();
