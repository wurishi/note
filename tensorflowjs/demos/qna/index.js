import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";

let modelPromise = {};
let context;
let question;
let search;
let answerDiv;

async function process() {
  const model = await modelPromise;
  const answers = await model.findAnswers(question.value, context.value);
  console.log(answers);
  answerDiv.innerHTML = answers
    .map((answer) => `${answer.text} (score = ${answer.score})`)
    .join("<br/>");
}

window.onload = () => {
  modelPromise = qna.load({
    modelUrl: "../model/mobilebert/model.json",
  });

  context = document.createElement("textarea");
  context.value =
    "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware. It is considered one of the Big Four technology companies, alongside Amazon, Apple, and Facebook. Google was founded in September 1998 by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. Together they own about 14 percent of its shares and control 56 percent of the stockholder voting power through supervoting stock. They incorporated Google as a California privately held company on September 4, 1998, in California. Google was then reincorporated in Delaware on October 22, 2002. An initial public offering (IPO) took place on August 19, 2004, and Google moved to its headquarters in Mountain View, California, nicknamed the Googleplex. In August 2015, Google announced plans to reorganize its various interests as a conglomerate called Alphabet Inc. Google is Alphabet's leading subsidiary and will continue to be the umbrella company for Alphabet's Internet interests. Sundar Pichai was appointed CEO of Google, replacing Larry Page who became the CEO of Alphabet.";
  document.body.appendChild(context);
  context.style.width = "500px";

  document.body.appendChild(document.createElement("br"));

  question = document.createElement("input");
  question.value = "Who is the CEO of Google?";
  document.body.appendChild(question);

  search = document.createElement("button");
  search.textContent = "搜索";
  document.body.appendChild(search);
  search.onclick = process;

  answerDiv = document.createElement("div");
  document.body.appendChild(answerDiv);
};
