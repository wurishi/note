import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as Face from "@tensorflow-models/blazeface/dist/face";
import * as tfconv from "@tensorflow/tfjs-converter";

// console.log(Face.BlazeFaceModel);
// console.log(tfconv);

const INPUT_WIDTH = 128;
const INPUT_HEIGHT = 128;
const MAX_FACES = 10;
const iouThreshold = 0.3;
const scoreThreshold = 0.75;

async function main() {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // const model = await blazeface.load();
  const URL = "../model/1/model.json";
  const bmodel = await tfconv.loadGraphModel(URL);
  const model = new Face.BlazeFaceModel(
    bmodel,
    INPUT_WIDTH,
    INPUT_HEIGHT,
    MAX_FACES,
    iouThreshold,
    scoreThreshold
  );

  const img = await imgP("../img.jpg");

  const returnTensors = false;
  const predictions = await model.estimateFaces(img, returnTensors);

  ctx.drawImage(img, 0, 0);
  if (predictions.length > 0) {
    /**
     * predictions = 
     * [
     *  {
     *    topLeft:[x,y],
     *    bottomRight:[x,y],
     *    probability:[0.912],
     *    landmarks:[
     *      [x,y], // right eye
     *      [x,y], // left eye
     *      [x,y], // nose
     *      [x,y], // mouth
     *      [x,y], // right ear
     *      [x,y], // left ear
     *    ]
     *  }
     * ]
     */
    for (let i = 0, len = predictions.length; i < len; i++) {
      const start = predictions[i].topLeft;
      const end = predictions[i].bottomRight;
      const size = [end[0] - start[0], end[1] - start[1]];

      ctx.fillStyle = "rgba(255,0,0,0.3)";
      ctx.fillRect(start[0], start[1], size[0], size[1]);
    }
  }
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
