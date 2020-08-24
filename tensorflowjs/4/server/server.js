require("@tensorflow/tfjs");
// @tensorflow/tfjs-node

const http = require("http");
const socketio = require("socket.io");
const pitch_type = require("./pitch_type");

const TIMEOUT_BETWEEN_EPOCHS_MS = 500;
const PORT = 18001;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const port = process.env.PORT || PORT;
  const server = http.createServer();
  const io = socketio(server);

  server.listen(port, () => {
    console.log(` > Running socket on port: ${port}`);
  });
  io.on("connect", (socket) => {
    socket.on("predictSample", async (sample) => {
      io.emit("predictResult", await pitch_type.predictSample(sample));
    });
  });

  let numTrainingIterations = 10;
  for (let i = 0; i < numTrainingIterations; i++) {
    console.log(`Training iteration : ${i + 1} / ${numTrainingIterations}`);
    await pitch_type.model.fitDataset(pitch_type.trainingData, { epochs: 1 });
    console.log("accuracyPerClass", await pitch_type.evaluate(true));
    await sleep(TIMEOUT_BETWEEN_EPOCHS_MS);
  }
  io.emit("trainingComplete", true);
}

run();
