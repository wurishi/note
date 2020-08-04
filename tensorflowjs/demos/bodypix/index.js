import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

let width = 200;
let height = 200;
let imgLoaded = false;
let canvas = null;

let segmentationMode = 0;
let maskMode = 0;
let drawMode = 0;

let img = null;
// !(function () {
//   img = new Image();
//   img.src = "../img2.jpg";
//   img.onload = () => {
//     width = img.naturalWidth;
//     height = img.naturalHeight;
//     loadAndPredict(img);
//   };
// })();

// video
let videoEl = null;
videoEl = document.createElement("video");
videoEl.autoplay = true;
videoEl.playsinline = true;
videoEl.muted = true;
videoEl.id = "webcam";
videoEl.width = width;
videoEl.height = height;
document.body.appendChild(videoEl);
loadAndPredict();

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
  // const net = await bodyPix.load();
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.5,
    quantBytes: 2,
  });

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
  }

  let webcam = null;
  if (videoEl) {
    webcam = await tf.data.webcam(videoEl);
  }
  await bodyPixFn(net, videoEl);
  do {
    if (webcam) {
      img = videoEl;
    }
    await bodyPixFn(net, img);
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
    maskImage = bodyPix.toMask(segmentation);
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
}
