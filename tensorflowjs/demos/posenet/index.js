import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";

let imgLoaded = false;
let mode = 0;
let inputMode = 0;
let minPartC = 0.5;
let minPoseC = 0.1;

const img = new Image();
img.src = "../img.jpg";
img.onload = () => {
  estimatePoseOnImage(img);
};

const videoEl = document.createElement("video");
videoEl.autoplay = true;
videoEl.playsinline = true;
videoEl.muted = true;
videoEl.id = "webcam";
videoEl.width = 300;
videoEl.height = 300;

createSelect(["single", "multi"]).onchange = function () {
  mode = this.value;
  if (imgLoaded) {
    estimatePoseOnImage(img);
  }
};

createSelect(["img mode", "web cam"]).onchange = function () {
  inputMode = this.value;
  if (imgLoaded) {
    estimatePoseOnImage(img);
  }
};

function createRange(label, defaultValue) {
  const span = document.createElement("span");
  span.textContent = label;
  span.style.margin = "10px";
  document.body.appendChild(span);

  const input = document.createElement("input");
  input.type = "range";
  input.min = 0.01;
  input.max = 1;
  input.step = 0.01;
  input.value = defaultValue;
  document.body.appendChild(input);
  return input;
}

createRange("minPartConfidence", 0.5).onchange = function () {
  minPartC = this.value;
  if (imgLoaded) {
    estimatePoseOnImage(img);
  }
};
createRange("minPoseConfidence", 0.1).onchange = function () {
  minPoseC = this.value;
  if (imgLoaded) {
    estimatePoseOnImage(img);
  }
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

async function estimatePoseOnImage(imageElement) {
  imgLoaded = false;
  const net = await posenet.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.5,
  });
  // const net = await posenet.load({
  //   modelUrl:'../model/100/model-stride16.json'
  // })

  if (inputMode == 0) {
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
  } else {
    canvas.width = videoEl.width;
    canvas.height = videoEl.height;
  }

  let webcam = await tf.data.webcam(videoEl);
  do {
    if (inputMode == 0) {
      webcam = null;
    }
    let input = imageElement;
    if (webcam) {
      input = videoEl;
    }

    let poses = [];
    if (mode == 1) {
      poses = await net.estimateMultiplePoses(input, {
        flipHorizontal: false,
      });
    } else {
      const pose = await net.estimateSinglePose(input, {
        flipHorizontal: false,
      });
      poses.push(pose);
    }

    await drawResults(webcam, canvas, poses, minPartC, minPoseC);
    await tf.nextFrame();
  } while (webcam);

  imgLoaded = true;
}

async function drawResults(
  webcam,
  canvas,
  poses,
  minPartConfidence,
  minPoseConfidence
) {
  let rImage = img;
  if (webcam) {
    // webcam.capture()
    rImage = videoEl;
  }
  renderImageToCanvas(rImage, canvas);
  const ctx = canvas.getContext("2d");
  poses.forEach((pose) => {
    if (pose.score >= minPoseConfidence) {
      drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      drawSkeleton(pose.keypoints, minPartConfidence, ctx);
      drawBoundingBox(pose.keypoints, ctx);
    }
  });
}

// tools
const COLOR = "aqua";
const BOX_COLOR = "red";
const LINE_WIDTH = 2;

function createSelect(arr) {
  const selectEl = document.createElement("select");
  arr.forEach((label, idx) => {
    const option = document.createElement("option");
    option.value = idx;
    option.label = label;
    selectEl.appendChild(option);
  });
  document.body.appendChild(selectEl);
  return selectEl;
}

function renderImageToCanvas(image, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
}

function toTuple({ x, y }) {
  return [y, x];
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint.score < minConfidence) {
      continue;
    }
    const { x, y } = keypoint.position;
    drawPoint(ctx, x * scale, y * scale, 3, COLOR);
  }
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((p) => {
    drawSegment(
      toTuple(p[0].position),
      toTuple(p[1].position),
      COLOR,
      scale,
      ctx
    );
  });
}

function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX,
    boundingBox.minY,
    boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY
  );

  ctx.strokeStyle = BOX_COLOR;
  ctx.stroke();
}
