import {Socket} from "phoenix";
import { elements as uiElements } from "./ui";
import {OmniOscillator, AmplitudeEnvelope, Volume, Master, Distortion} from 'Tone';

const socket = new Socket("/socket");

socket.connect();

const channel = socket.channel("channel:control", {});

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp); })
  .receive("error", resp => { console.log("Unable to join", resp); });

for (const key in uiElements) {
  const { elem } = uiElements[key];
  elem.on('change', (value) => {
    channel.push("update", { body: { key: key, value: value }});
  });
};

const dist = new Distortion().toMaster();
const osc = new OmniOscillator("C#4", "pwm");
osc.start();
const env = new AmplitudeEnvelope();
osc.connect(env);
env.toMaster();

channel.on("update", (payload) => {
  const { body: { key, value } } = payload;
  const { elem, type } = uiElements[key];

  switch (type) {
  case 'slider':
    elem._value.update(value);
    elem.position.value = elem._value.normalized;
    elem.render();
    osc.frequency.value = value * 500;
    break;
  case 'toggle':
    elem._state.flip(value);
    elem.render();
    break;
  case 'button':
    elem.position.x = value.x;
    elem.position.y = value.y;
    elem._state.flip(value.state);
    elem.render();
    if (value.state) {
      env.triggerAttack();
    } else {
      env.triggerRelease();
    }
    break;
  }
});

export default socket;
