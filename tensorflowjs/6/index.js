let net;

async function app() {
  console.log("Loading mobilenet...");

  const loadParams = { version: 2, alpha: 1 };
  net = await mobilenet.load();
  console.log("Successfully loaded model");

  const imgEl = document.getElementById("img");
  const result = await net.classify(imgEl);
  console.log(result);
}

app();
