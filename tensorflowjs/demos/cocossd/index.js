import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";

let imgOrVideo = 0;

const selectEl = document.createElement("select");
["img mode", "web cam"].forEach((label, idx) => {
  const option = document.createElement("option");
  option.label = label;
  option.value = idx;
  selectEl.appendChild(option);
});
document.body.appendChild(selectEl);
selectEl.onchange = function () {
  imgOrVideo = this.value;
};

const img = new Image();
img.src = "../img.jpg";
img.onload = () => {
  run();
};

const videoEl = document.createElement("video");
videoEl.muted = true;
videoEl.autoplay = true;
videoEl.width = 300;
videoEl.height = 300;

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

async function run() {
  const model = await cocossd.load({
    base: "lite_mobilenet_v2"
    // modelUrl: "../model/litev2/model.json",
  });

  await tf.data.webcam(videoEl);

  while (true) {
    let input = img;
    if (imgOrVideo == 0) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    } else {
      canvas.width = videoEl.width;
      canvas.height = videoEl.height;
      input = videoEl;
    }
    const predictions = await model.detect(input, 20, 0.2);
    drawResult(input, predictions);
    await tf.nextFrame();
  }
}

const waitTime = (sleep = 1000) => new Promise((r) => setTimeout(r, sleep));

function drawResult(img, results) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  ["green", "red", "pink", "blue", "aqua"].forEach((color, idx) => {
    if (results[idx]) {
      const { bbox, class: className, score } = results[idx];
      ctx.beginPath();
      ctx.rect(...bbox);
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();

      ctx.font = "16px Arial";
      const text = score.toFixed(3) + " " + className;
      const x = bbox[0];
      const y = bbox[1] > 10 ? bbox[1] - 5 : 10;
      ctx.fillStyle = "black";
      ctx.fillText(text, x + 1, y + 1);

      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    }
  });
}
