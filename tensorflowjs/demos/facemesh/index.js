import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import * as backend from "@tensorflow/tfjs-backend-webgl";
import { TRIANGULATION } from "./triangulation";
// import * as Face from '@tensorflow-models/blazeface/dist/face';
import * as tfconv from "@tensorflow/tfjs-converter";

async function main() {
  const video = await setupCamera();

  video.play();

  let canvas = document.getElementById("output");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.fillStyle = "#32EEDB";
  ctx.strokeStyle = "#32EEDB";
  ctx.lineWidth = 0.5;

  const model = await facemesh.load();

  // const blazefaceModel = await tfconv.loadGraphModel(
  //   "../model/blazeface/model.json"
  // );
  // const facemeshModel = await tfconv.loadGraphModel(
  //   "../model/facemesh/model.json"
  // );

  // const model = new facemesh.FaceMesh(facemeshModel, blazefaceModel);

  await renderPrediction(model, video, ctx);

  // const img = await imgP("../img.jpg");

  // const predictions = await model.estimateFaces(img);

  // console.log(predictions);
  // if (predictions.length > 0) {
  // }
}

main();

function imgP(url) {
  return new Promise((r) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      r(image);
    };
  });
}

async function setupCamera() {
  let video = document.getElementById("video");
  if (!video) {
    video = document.createElement("video");
    video.id = "video";
    video.style = "display:none;";
    document.body.appendChild(video);
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: 400,
      height: 300,
    },
  });
  video.srcObject = stream;

  return new Promise((r) => {
    video.onloadedmetadata = () => r(video);
  });
}

let triangulateMesh = true;

const tmEl = document.createElement("select");
const option1 = document.createElement("option");
option1.label = "是";
option1.value = true;
tmEl.appendChild(option1);
const option2 = document.createElement("option");
option2.label = "否";
option2.value = "";
tmEl.appendChild(option2);

document.body.appendChild(tmEl);
tmEl.onchange = () => {
  triangulateMesh = tmEl.value ? true : false;
};

async function renderPrediction(model, video, ctx) {
  const predictions = await model.estimateFaces(video);

  ctx.drawImage(video, 0, 0, 400, 300);

  if (predictions.length > 0) {
    const pointsData = [];
    predictions.forEach((prediction) => {
      const keypoints = prediction.scaledMesh;
      if (triangulateMesh) {
        for (let i = 0, len = TRIANGULATION.length / 3; i < len; i++) {
          const points = [
            TRIANGULATION[i * 3],
            TRIANGULATION[i * 3 + 1],
            TRIANGULATION[i * 3 + 2],
          ].map((index) => keypoints[index]);
          drawPath(ctx, points, true);
        }
      } else {
        for (let i = 0, len = keypoints.length; i < len; i++) {
          const x = keypoints[i][0];
          const y = keypoints[i][1];

          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      // pointsData.push(
      //   keypoints.map((point) => [-point[0], -point[1], -point[2]])
      // );
    });

    requestAnimationFrame(() => {
      renderPrediction(model, video, ctx);
    });
  }
}

const span = document.createElement("span");
document.body.appendChild(span);

function drawPath(ctx, points, closePath) {
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1, len = points.length; i < len; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }
  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}
