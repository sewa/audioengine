import { Socket } from "phoenix";
import { get } from './service';
import { initTone } from './tone';

const actions = {
  initTone: state => {
    get('clock').subscribe((xhr) => {
      initTone(xhr.response);
    });
  },
  connect: name => (state, actions) => {
    const socket = new Socket("/socket");
    socket.connect();

    const channel = socket.channel(`channel:${name}`, {});

    channel.join().receive("ok", resp => {
      actions.channels.connected({ name, channel });
    });

    channel.on("update", ({ body: { key, value } }) => {
      actions.receiveChange({ key, value });
    });
  },
  pushChange: item => state => {
    state.channels.control.push("update", { body: { key: item.key, value: item.value }});
  },

  // state updates
  channels: {
    connected: ({ name, channel }) => state => (
      { [name]: channel }
    )
  },
  nxInstances: {
    add: ({ key, instance }) => state => (
      { [key]: instance }
    )
  },
  receiveChange: item => state => (
    { currentChange: item }
  )
};

export {
  actions
};
