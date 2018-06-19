import { Socket } from "phoenix";

let nxInstances = {};
const addNxInstance = ({ key, instance }) => {
  nxInstances[key] = instance;
};

const actions = {
  connect: name => (state, actions) => {
    const socket = new Socket("/socket");
    socket.connect();

    const channel = socket.channel(`channel:${name}`, {});

    channel.join().receive("ok", resp => {
      actions.connected({ name, channel });
    });

    channel.on("update", (payload) => {
      const { body: { key, value } } = payload;
      actions.receiveChange({ key, value });
    });
    // nothing is returned, no state update. it is preformed in connected.
  },
  connected: ({ name, channel }) => state => {
    state.channels[name] = channel;
    return state;
  },
  pushChange: item => state => {
    state.channels.control.push("update", { body: { key: item.key, value: item.value }});
    // nothing is returned, no state update
  },
  receiveChange: item => state => {
    return { currentChange: item };
  }
};

export {
  addNxInstance,
  nxInstances,
  actions
};
