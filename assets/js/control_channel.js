import { Socket } from "phoenix";

const socket = new Socket("/socket");
socket.connect();
const channel = socket.channel("channel:control", {});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp); })
  .receive("error", resp => { console.log("Unable to join", resp); });

channel.on("update", (payload) => {
  const { body: { key, value } } = payload;
  console.log(payload);
  // const { elem, type } = uiElements[key];

  // switch (type) {
  // case 'slider':
  //   break;
  // case 'toggle':
  //   elem._state.flip(value);
  //   elem.render();
  //   break;
  // case 'button':
  //   break;
  // case 'sequencer':
  //   break;
  // }
});

const pushChange = ({ key, value }) => {
  channel.push("update", { body: { key: key, value: value }});
};

export {
  pushChange
}
