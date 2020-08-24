import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import * as backend from "@tensorflow/tfjs-backend-webgl";

const fingerLookupIndices = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

async function main() {
  const model = await handpose.load();

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

  landmarksRealTime(model, video, ctx);
}

function landmarksRealTime(model, video, ctx) {
  async function frameLandmarks() {
    ctx.drawImage(video, 0, 0, 400, 300);
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const result = predictions[0].landmarks;
      drawKeypoints(ctx, result, predictions[0].annotations);
    }

    requestAnimationFrame(frameLandmarks);
  }

  frameLandmarks();
}

main();

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

function drawKeypoints(ctx, keypoints) {
  const keypointsArray = keypoints;

  for (let i = 0, len = keypointsArray.length; i < len; i++) {
    const y = keypointsArray[i][0];
    const x = keypointsArray[i][1];
    drawPoint(ctx, x - 2, y - 2, 3);
  }

  const fingers = Object.keys(fingerLookupIndices);
  for (let i = 0, len = fingers.length; i < len; i++) {
    const finger = fingers[i];
    const points = fingerLookupIndices[finger].map((idx) => keypoints[idx]);
    drawPath(ctx, points, false);
  }
}

function drawPoint(ctx, y, x, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

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
