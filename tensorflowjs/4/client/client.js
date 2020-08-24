import io from "socket.io-client";

const predictContainer = document.getElementById("predictContainer");
const predictButton = document.getElementById("predict-button");

const socket = io("http://localhost:18001", {
  reconnectionDelay: 300,
  reconnectionDelayMax: 300,
});

let testSample = [2.668, -114.333, -1.908, 4.786, 25.707, -45.21, 78, 0];

predictButton.onclick = () => {
  predictButton.disabled = true;
  socket.emit("predictSample", testSample);
};

socket.on("connect", () => {
  document.getElementById("trainingStatus").innerHTML = "Training Complete";
  document.getElementById("predictSample").innerHTML =
    "[" + testSample.join(", ") + "]";
  predictContainer.style.display = "block";
});

socket.on("predictResult", (result) => {
  plotPredictResult(result);
});

socket.on("disconnect", () => {
  document.getElementById("trainingStatus").innerHTML = "";
  predictContainer.style.display = "none";
  document.getElementById("waiting-msg").style.display = "block";
});

function plotPredictResult(result) {
  predictButton.disabled = false;
  document.getElementById("predictResult").innerHTML = result;
  console.log(result);
}

const inputContainer = document.getElementById("inputContainer");
const inputArr = [];
testSample.forEach((v, idx) => {
  const div = document.createElement("div");
  div.className = "inputDiv";
  const label = document.createElement("span");
  label.innerHTML = `${idx}:`;
  div.appendChild(label);
  const input = document.createElement("input");
  input.value = v;
  div.appendChild(input);
  inputArr.push(input);

  inputContainer.appendChild(div);
});

const inputChangeButton = document.getElementById("inputChangeButton");
inputChangeButton.onclick = () => {
  testSample = inputArr.map((input) =>
    isNaN(input.value) ? 0 : Number(input.value)
  );
  if (!predictButton.disabled) {
    predictButton.click();
    document.getElementById("predictSample").innerHTML =
      "[" + testSample.join(", ") + "]";
  }
};
