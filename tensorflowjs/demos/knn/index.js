import * as tf from "@tensorflow/tfjs";
import * as mobilenetModule from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";

async function run() {
  const classifier = knnClassifier.create();

  const mobilenet = await mobilenetModule.load({
    version: 1,
    alpha: 0.25,
  });

  const arr1 = [];
  const arr2 = [];
  for (let i = 1; i <= 5; i++) {
    const dog = await imgP("../dog" + i + ".jpg");
    const n = await imgP("../n" + i + ".jpg");
    arr1.push(dog);
    arr2.push(n);
  }

  for (let i = 0; i < 3; i++) {
    const logits0 = mobilenet.infer(
      tf.browser.fromPixels(arr1[i]),
      "conv_preds"
    );
    classifier.addExample(logits0, "dog");

    const logits1 = mobilenet.infer(
      tf.browser.fromPixels(arr2[i]),
      "conv_preds"
    );
    classifier.addExample(logits1, "n");
  }

  console.log("Predictions:");
  for (let i = 0; i < 5; i++) {
    const logits = mobilenet.infer(
      tf.browser.fromPixels(arr1[i]),
      "conv_preds"
    );
    const result = await classifier.predictClass(logits);
    console.log("dog" + i, result);
  }

  for (let i = 0; i < 5; i++) {
    const logits = mobilenet.infer(
      tf.browser.fromPixels(arr2[i]),
      "conv_preds"
    );
    const result = await classifier.predictClass(logits);
    console.log("n" + i, result);
  }
}

run();

function imgP(url) {
  return new Promise((r) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      r(img);
    };
  });
}
