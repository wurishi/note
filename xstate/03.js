import {
  Machine,
  interpret,
  assign,
} from "./node_modules/xstate/dist/xstate.web.js";

const machine = Machine({
  initial: "red",
  states: {
    red: {},
  },
  context: {
    count: 0,
    user: null,
  },
});

console.log(machine.initialState.context);

const service = interpret(
  machine.withContext({
    count: 10,
    test: 1,
    user: {
      name: "Jerry",
    },
  })
);
service.start();
console.log(service.state.context);

const lightMachine = Machine(
  {
    initial: "red",
    states: {
      red: {
        entry: (context, event) => console.log("entry red"),
        exit: (context, event) => console.log("exit red"),
        on: {
          CLICK: {
            target: "green",
            actions: (context, event) =>
              console.log("hello green", context, event),
          },
        },
      },
      green: {
        entry: ["entryGreen", "temp"],
        exit: "exitGreen",
        on: {
          CLICK: {
            target: "red",
            actions: "greenClick",
          },
        },
      },
    },
  },
  {
    actions: {
      greenClick: (context, event) => console.log("hello red"),
      entryGreen: (context, event) => console.log("entry green"),
      exitGreen: (context, event) => console.log("exit green"),
      temp: () => console.log("temp"),
    },
  }
);

const state0 = lightMachine.initialState;
const state1 = lightMachine.transition(state0, "CLICK");
const state2 = lightMachine.transition(state1, "CLICK");
console.log(state1);

const div = document.createElement("div");
document.body.appendChild(div);

const counterMachine = Machine(
  {
    id: "counter",
    initial: "ENABLED",
    context: {
      count: 0,
    },
    states: {
      ENABLED: {
        on: {
          INC: { actions: ["increment", "updateView"] },
          DYNAMIC_INC: { actions: ["dynamic_increment", "updateView"] },
          RESET: { actions: ["reset", "updateView"] },
          DISABLE: "DISABLED",
        },
      },
      DISABLED: {
        on: {
          ENABLE: "ENABLED",
        },
      },
    },
  },
  {
    actions: {
      increment: assign({
        count: (context) => context.count + 1,
      }),
      dynamic_increment: assign({
        count: (context, event) => {
          console.log(context, event);
          return context.count + (event.value || 0);
        },
      }),
      reset: assign({
        count: 0,
      }),
      updateView: (context) => {
        div.textContent = context.count;
      },
    },
  }
);
const counterService = interpret(counterMachine);
counterService.start();
console.log("----------------");
console.log(counterService.state);

const btn = document.createElement("button");
btn.textContent = "increment";
document.body.appendChild(btn);
btn.addEventListener("click", () => {
  counterService.send("INC");
  // console.log(counterService.state);
});

const btn2 = document.createElement("button");
btn2.textContent = "increment 10";
document.body.appendChild(btn2);
btn2.addEventListener("click", () => {
  counterService.send({ type: "DYNAMIC_INC", value: 10 });
});

const btn3 = document.createElement("button");
btn3.textContent = "enable";
document.body.appendChild(btn3);
btn3.onclick = () => counterService.send("ENABLE");

const btn4 = document.createElement("button");
btn4.textContent = "disable";
document.body.appendChild(btn4);
btn4.onclick = () => counterService.send("DISABLE");
