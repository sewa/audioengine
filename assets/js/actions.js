import { Socket } from "phoenix";
import { get } from './service';
import { initTone } from './tone';

const actions = {
  initTone: state => {
    get('clock').subscribe((xhr) => {
      initTone(xhr.response);
    });
  },
  channels: {
    connect: name => (state, actions) => {
      const socket = new Socket("/socket");
      socket.connect();

      const channel = socket.channel(`channel:${name}`, {});

      channel.join().receive("ok", resp => {
        actions.connected({ name, channel });
      });

      channel.on("update", ({ body: { key, value } }) => {
        actions.receiveChange({ name, channel, key, value });
      });
    },
    pushChange: ({ key, value }) => ({ control: { channel } }) => {
      channel.push("update", { body: { key, value }});
    },
    // state updates
    connected: ({ name, channel }) => state => (
      { [name]: { channel } }
    ),
    receiveChange: ({ name, channel, key, value }) => state => (
      { [name]: { channel, key, value } }
    )
  },
  nxInstances: {
    add: ({ key, instance }) => state => (
      { [key]: instance }
    )
  },
};

export {
  actions
};
