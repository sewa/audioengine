import { Socket } from "phoenix";
import { env, osc } from './tone';

const state = {
  instruments: {
    default: {
      toggle1: {
        type: 'toggle',
        options: {
          state: true
        }
      },
      button1: {
        type: 'button'
      },
      slider1: {
        type: 'slider'
      },
      sequencer1: {
        type: 'sequencer',
        options: {
          size: [400,200],
          mode: 'toggle',
          rows: 5,
          columns: 8
        }
      },
    }
  }
};

let nxInstances = {};
const addNxInstance = ({ key, instance }) => {
  nxInstances[key] = instance;
};

const socket = new Socket("/socket");
socket.connect();
const channel = socket.channel("channel:control", {});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp); })
  .receive("error", resp => { console.log("Unable to join", resp); });

channel.on("update", (payload) => {
  const { body: { key, value } } = payload;
  const nxInstance = nxInstances[key];

  switch (nxInstance.type) {
  case 'Button':
    nxInstance.position.x = value.x;
    nxInstance.position.y = value.y;
    nxInstance._state.flip(value.state);
    nxInstance.render();
    if (value.state) {
      env.triggerAttack();
    } else {
      env.triggerRelease();
    }
    break;
  case 'Sequencer':
    nxInstance.matrix.pattern[value.row][value.column] = value.state;
    nxInstance.update();
    break;
  case 'Slider':
    nxInstance._value.update(value);
    nxInstance.position.value = nxInstance._value.normalized;
    nxInstance.render();
    osc.frequency.value = value * 500;
    break;
  case 'Toggle':
    nxInstance._state.flip(value);
    nxInstance.render();
    break;
  }
});

const actions = {
  instruments: {
    pushChange: item => state =>
      channel.push("update", { body: { key: item.key, value: item.value }})
  }
};

export {
  addNxInstance,
  actions,
  state
};
