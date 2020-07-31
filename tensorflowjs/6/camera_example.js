let net;
const webCamElement = document.getElementById("webcam");
const classifier = knnClassifier.create();

async function app() {
  console.log("Loading mobilenet...");

  net = await mobilenet.load();
  console.log("Successfully loaded model");

  const webcam = await tf.data.webcam(webCamElement);

  const addExample = async (classId) => {
    const img = await webcam.capture();
    const activation = net.infer(img, true);
    classifier.addExample(activation, classId);
    img.dispose();
  };

  document
    .getElementById("class-a")
    .addEventListener("click", () => addExample(0));
  document
    .getElementById("class-b")
    .addEventListener("click", () => addExample(1));
  document
    .getElementById("class-c")
    .addEventListener("click", () => addExample(2));
  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      const activation = net.infer(img, "conv_preds");
      const result = await classifier.predictClass(activation);

      const classes = ["A", "B", "C"];
      document.getElementById("console").innerText = `
      prediction: ${classes[result.label]}\n
      probability: ${result.confidences[result.label]}
    `;
      img.dispose();
    }

    // const result = await net.classify(img);

    // document.getElementById("console").innerText = `
    // prediction: ${result[0].className}
    // probability: ${result[0].probability}
    // `;

    // img.dispose();

    await tf.nextFrame();
  }

}

app();
