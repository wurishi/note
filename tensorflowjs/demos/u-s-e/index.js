import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { UniversalSentenceEncoderQnA } from '@tensorflow-models/universal-sentence-encoder/dist/use_qna';
import * as tfconv from '@tensorflow/tfjs-converter';
import { loadVocabulary } from '@tensorflow-models/universal-sentence-encoder/dist/tokenizer';

class MyEncoder extends use.UniversalSentenceEncoder {
  async loadModelFromLocal() {
    return tfconv.loadGraphModel('../model/1/model.json');
  }
  async loadFromLocal() {
    const [model, vocabulary] = await Promise.all([
      this.loadModelFromLocal(),
      loadVocabulary('../model/1/vocab.json'),
    ]);
    this.model = model;
    this.tokenizer = new use.Tokenizer(vocabulary);
  }
}

async function run() {
  // const model = await use.load();
  const encoder = new MyEncoder();
  await encoder.loadFromLocal();
  const model = encoder;

  const sentences = ['Hello', 'How are you?', '你好吗?'];
  const embeddings = await model.embed(sentences);

  embeddings.print(true);

  const r = model.tokenizer.encode(sentences.join('.'));
  console.log(r);

  QnA();
}

run();

class MyQnA extends UniversalSentenceEncoderQnA {
  async loadModelFromLocal() {
    return tfconv.loadGraphModel('../model/qa/model.json');
  }
  async loadFromLocal() {
    const [model, vocabulary] = await Promise.all([
      this.loadModelFromLocal(),
      loadVocabulary('../model/qa/vocab.json'),
    ]);
    this.model = model;
    this.tokenizer = new use.Tokenizer(
      vocabulary,
      3 /* RESERVED_SYMBOLS_COUNT */
    );
  }
}

const outputEl = document.createElement('div');
document.body.appendChild(outputEl);

async function QnA() {
  // const model = await use.loadQnA();
  const qna = new MyQnA();
  await qna.loadFromLocal();
  const model = qna;

  const input = {
    queries: [
      'How are you feeling today?',
      'What is captial of China?',
      '你叫什么名字',
      '1 + 1 = ?'
    ],
    responses: [
      `I'm not feeling very well.`,
      'Beijing is the capital of China.',
      '我叫王大锤',
      '2',
      '= 2',
      '= 1'
    ],
  };

  const scores = [];

  const embeddings = await model.embed(input);

  const embed_query = await embeddings['queryEmbedding'].array();
  const embed_responses = await embeddings['responseEmbedding'].array();

  for (let i = 0; i < input.queries.length; i++) {
    for (let j = 0; j < input.responses.length; j++) {
      const score = dotProduct(embed_query[i], embed_responses[j]);
      scores.push(score);

      const h = document.createElement('h3');
      h.textContent = 'Q: ' + input.queries[i];
      outputEl.appendChild(h);
      const p = document.createElement('p');
      p.textContent = 'A: ' + input.responses[j] + `(${score.toFixed(2)})`;
      outputEl.appendChild(p);
    }
  }

  console.log(scores);
}

function dotProduct(xs, ys) {
  const sum = (xs) => (xs ? xs.reduce((a, b) => a + b, 0) : undefined);

  return xs.length === ys.length
    ? sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
}

function zipWith(f, xs, ys) {
  const ny = ys.length;
  return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
}
