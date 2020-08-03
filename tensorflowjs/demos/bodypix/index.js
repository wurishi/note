import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";

const img = new Image();
img.src = "../img2.jpg";
img.onload = loadAndPredict;

async function loadAndPredict() {
  const net = await bodyPix.load();
  // const segmentation = await net.segmentPerson(img);
  const segmentation = await net.segmentPersonParts(img);

  // const coloredPartImage = bodyPix.toMask(segmentation);
  const coloredPartImage = bodyPix.toColoredPartMask(segmentation);
  const opacity = 0.7;
  const flipHorizontal = false;
  const maskBlurAmount = 0;
  const pixelCellWidth = 10.0;

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  document.body.appendChild(canvas);

  // bodyPix.drawMask(
  //   canvas,
  //   img,
  //   coloredPartImage,
  //   opacity,
  //   maskBlurAmount,
  //   flipHorizontal
  // );

  bodyPix.drawPixelatedMask(
    canvas,
    img,
    coloredPartImage,
    opacity,
    maskBlurAmount,
    flipHorizontal,
    pixelCellWidth
  );
}
