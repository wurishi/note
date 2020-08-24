let net;
const webCamElement = document.getElementById("webcam");

async function app() {
  console.log("Loading mobilenet...");

  net = await mobilenet.load();
  console.log("Successfully loaded model");

  const webcam = await tf.data.webcam(webCamElement);
  while (true) {
    const img = await webcam.capture();
    const result = await net.classify(img);

    const log = result.map(
      (item) => `
      prediction: ${item.className}\n
      probability: ${item.probability}
    `
    );
    document.getElementById("console").innerText = log.join("\n\n");

    // document.getElementById("console").innerText = `
    // prediction: ${result[0].className}
    // probability: ${result[0].probability}
    // `;

    img.dispose();

    await tf.nextFrame();
  }

  // const imgEl = document.getElementById('img');
  // const result = await net.classify(imgEl);
  // console.log(result);
}

app();
