import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';
import * as tfconv from '@tensorflow/tfjs-converter';

const threshold = 0.9;

const setences = ['you suck'];

// vocab.json 无法自定义路径
toxicity.ToxicityClassifier.prototype.loadModel = async function () {
  return await tfconv.loadGraphModel('../model/1/model.json');
};

async function run() {
  const model = await toxicity.load(threshold, ['identity_attack']); // , ['identity_attack'] 需要手动引入tfconv

  const predictions = await model.classify(setences);

  console.log(predictions);
}

run();
