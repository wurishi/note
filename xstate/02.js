import { Machine, interpret } from "./node_modules/xstate/dist/xstate.web.js";

const lightMachine = Machine({
  initial: "red", // 初始状态
  // 表示Machine拥有red, green, yellow 三种状态
  states: {
    red: {
      on: {
        CLICK: "green",
      },
    },
    green: {
      on: {
        CLICK: "yellow",
      },
    },
    yellow: {
      on: {
        CLICK: "red",
      },
    },
  },
});

const state0 = lightMachine.initialState;
console.log(state0);

const state1 = lightMachine.transition(state0, "CLICK");
console.log(state1);

const state2 = lightMachine.transition(state1, "CLICK");
console.log(state2);

const state3 = lightMachine.transition(state2, "CLICK");
console.log(state3);

console.log(state0.value);
console.log(state0.matches("red"));
console.log(state0.matches("yellow"));
console.log(state3.transitions);

const service = interpret(lightMachine);

service.start();

console.log(service);
service.send("CLICK");
console.log(service);

service.stop();
