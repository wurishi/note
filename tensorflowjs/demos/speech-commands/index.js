// import * as tf from "@tensorflow/tfjs";
// import * as speechCommands from "@tensorflow-models/speech-commands";

async function run() {
  // FFT_TYPE: BROWSER_FFT or SOFT_FFT
  // vocabulary: 18w or directional4w 如果指定model和metadata 则vocabulary得为null / undefined
  // model url?
  // metadata url?
  const recognizer = speechCommands.create(
    "BROWSER_FFT",
    null,
    "http://127.0.0.1:53363/demos/speech-commands/model/18w/model.json",
    "http://127.0.0.1:53363/demos/speech-commands/model/18w/metadata.json"
  );

  await recognizer.ensureModelLoaded();

  console.log(recognizer.wordLabels());

  recognizer.listen(
    (result) => {
      console.log(result);
    },
    {
      includeSpectrogram: true,
      probabilityThreshold: 0.75,
    }
  );

  await new Promise((r) => setTimeout(r, 10e3));

  recognizer.stopListening();
  console.log("end");
}

// run();
learning();

// 学习
async function learning() {
  const baseRecognizer = speechCommands.create(
    "BROWSER_FFT"
    // null,
    // "http://127.0.0.1:53363/demos/speech-commands/model/18w/model.json",
    // "http://127.0.0.1:53363/demos/speech-commands/model/18w/metadata.json"
  );

  await baseRecognizer.ensureModelLoaded();

  const transferRecognizer = baseRecognizer.createTransfer("colors");

  await transferRecognizer.collectExample("red");
  await transferRecognizer.collectExample("green");
  await transferRecognizer.collectExample("blue");
  await transferRecognizer.collectExample("red");

  await transferRecognizer.collectExample("_background_noise_");
  await transferRecognizer.collectExample("green");
  await transferRecognizer.collectExample("blue");
  await transferRecognizer.collectExample("_background_noise_");

  console.log(transferRecognizer.countExamples());

  await transferRecognizer.train({
    epochs: 25,
    callback: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
      },
    },
  });

  await transferRecognizer.listen(
    (result) => {
      const words = transferRecognizer.wordLabels();
      for (let i = 0; i < words.length; i++) {
        console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
      }
    },
    { probabilityThreshold: 0.75 }
  );

  await new Promise((r) => setTimeout(r, 10e3));
  transferRecognizer.stopListening();
  console.log("stop");

  const serizlized = transferRecognizer.serializeExamples();
  console.log(serizlized);
  // newTransferRecognizer.loadExamples
}
