import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as posenet from "@tensorflow-models/posenet";

let width = 400;
let height = 400;
let imgLoaded = false;
let canvas = null;

let segmentationMode = 0;
let maskMode = 0;
let drawMode = 0;
let imgOrCamera = 0;

let img = null;
img = new Image();
img.src = "../img.jpg";
img.onload = () => {
  loadAndPredict(img);
};

// video
let videoEl = null;
videoEl = document.createElement("video");
videoEl.autoplay = true;
videoEl.playsinline = true;
videoEl.muted = true;
videoEl.id = "webcam";
videoEl.width = width;
videoEl.height = height;
// document.body.appendChild(videoEl);

!(function () {
  const selectEl = document.createElement("select");
  ["img mode", "web cam"].forEach((label, idx) => {
    const optionEl = document.createElement("option");
    optionEl.value = idx;
    optionEl.label = label;
    selectEl.appendChild(optionEl);
  });
  document.body.appendChild(selectEl);
  selectEl.onchange = () => {
    imgOrCamera = selectEl.value;
    if (imgLoaded) {
      loadAndPredict(img);
    }
  };
})();

!(function () {
  const selectEl = document.createElement("select");
  [
    "segmentPerson",
    "segmentPersonParts",
    "segmentMultiPerson",
    "segmentMultiPersonParts",
  ].forEach((label, idx) => {
    const optionEl = document.createElement("option");
    optionEl.value = idx;
    optionEl.label = label;
    selectEl.appendChild(optionEl);
  });
  document.body.appendChild(selectEl);
  selectEl.onchange = () => {
    segmentationMode = selectEl.value;
    if (imgLoaded) {
      loadAndPredict(img);
    }
  };
})();

!(function () {
  const selectEl = document.createElement("select");
  ["drawMask", "drawPixelatedMask", "drawBokehEffect", "blurBodyPart"].forEach(
    (label, idx) => {
      const optionEl = document.createElement("option");
      optionEl.value = idx;
      optionEl.label = label;
      selectEl.appendChild(optionEl);
    }
  );
  document.body.appendChild(selectEl);
  selectEl.onchange = () => {
    drawMode = selectEl.value;
    if (imgLoaded) {
      loadAndPredict(img);
    }
  };
})();

!(function () {
  const selectEl = document.createElement("select");
  ["mask", "coloredPartMask"].forEach((label, idx) => {
    const optionEl = document.createElement("option");
    optionEl.value = idx;
    optionEl.label = label;
    selectEl.appendChild(optionEl);
  });
  document.body.appendChild(selectEl);
  selectEl.onchange = () => {
    maskMode = selectEl.value;
    if (imgLoaded) {
      loadAndPredict(img);
    }
  };
})();

async function loadAndPredict(img) {
  imgLoaded = false;
  // default
  // const net = await bodyPix.load();

  // MobileNetV1
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  });

  // ResNet50
  // const net = await bodyPix.load({
  //   architecture: "ResNet50",
  //   outputStride: 32,
  //   quantBytes: 2,
  // });

  if (!canvas) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }

  if (imgOrCamera == 0) {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  } else {
    canvas.width = width;
    canvas.height = height;
  }

  let webcam = null;
  if (videoEl) {
    webcam = await tf.data.webcam(videoEl);
  }
  do {
    if (imgOrCamera == 0) {
      webcam = null;
    }
    let input = img;
    if (webcam) {
      input = videoEl;
    }
    await bodyPixFn(net, input);
    await tf.nextFrame();
  } while (webcam);

  imgLoaded = true;
}

const opacity = 0.7;
const flipHorizontal = false;
const maskBlurAmount = 0;

const pixelCellWidth = 10.0;

const backgroundBlurAmount = 3;
const edgeBlurAmount = 3;

const faceBodyPartIdsToBlur = [0, 1];

async function bodyPixFn(net, img) {
  // 选用算法
  let segmentation;
  if (segmentationMode == 1) {
    segmentation = await net.segmentPersonParts(img);
  } else if (segmentationMode == 2) {
    segmentation = await net.segmentMultiPerson(img);
  } else if (segmentationMode == 3) {
    segmentation = await net.segmentMultiPersonParts(img);
  } else {
    segmentation = await net.segmentPerson(img);
  }

  // 选用mask
  let maskImage;
  if (maskMode == 1) {
    maskImage = bodyPix.toColoredPartMask(segmentation);
  } else {
    maskImage = bodyPix.toMask(
      segmentation,
      { r: 0, g: 0, b: 0, a: 255 },
      { r: 0, g: 0, b: 0, a: 0 },
      true
    );
  }

  if (drawMode == 0) {
    bodyPix.drawMask(
      canvas,
      img,
      maskImage,
      opacity,
      maskBlurAmount,
      flipHorizontal
    );
  } else if (drawMode == 1) {
    bodyPix.drawPixelatedMask(
      canvas,
      img,
      maskImage,
      opacity,
      maskBlurAmount,
      flipHorizontal,
      pixelCellWidth
    );
  } else if (drawMode == 2) {
    bodyPix.drawBokehEffect(
      canvas,
      img,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
  } else if (drawMode == 3) {
    bodyPix.blurBodyPart(
      canvas,
      img,
      segmentation,
      faceBodyPartIdsToBlur,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
  }
  drawPoses(segmentation, flipHorizontal, canvas.getContext("2d"));
}

function drawPoses(segmentation, flipHorizontal, ctx) {
  if (Array.isArray(segmentation)) {
    segmentation.forEach((s) => {
      let pose = s.pose;
      if (flipHorizontal) {
        pose = bodyPix.flipPoseHorizontal(pose, s.width);
      }
      drawKeypoints(pose.keypoints, 0.1, ctx);
      drawSkeleton(pose.keypoints, 0.1, ctx);
    });
  } else {
    segmentation.allPoses.forEach((pose) => {
      if (flipHorizontal) {
        pose = bodyPix.flipPoseHorizontal(pose, segmentation.width);
      }
      drawKeypoints(pose.keypoints, 0.1, ctx);
      drawSkeleton(pose.keypoints, 0.1, ctx);
    });
  }
}

const COLOR = "aqua";
const LINE_WIDTH = 2;

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
  for (let i = 0, len = keypoints.length; i < len; i++) {
    const keypoint = keypoints[i];
    if (keypoint.score < minConfidence) {
      continue;
    }
    const { y, x } = keypoint.position;
    drawPoint(ctx, x * scale, y * scale, 3, COLOR);
  }
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  function toTuple({ y, x }) {
    return [y, x];
  }

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
