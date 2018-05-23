import { Socket } from "phoenix";
import { elements as uiElements } from "./ui";
import { Tone, AudioContext, OmniOscillator, AmplitudeEnvelope, Volume, Master, Distortion} from 'Tone';

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

const Interface = {
  isMobile : false
};

$(function(){
  //mobile start
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    Interface.isMobile = true;
    $("body").addClass("Mobile");
    var element = $("<div>", {"id" : "MobileStart"}).appendTo("body");
    var btn = $("<div>").attr("class", "button").text("Start").appendTo(element);  
    $(btn).click(function() {
      osc.start();
      $(this).hide();
    });
  } else {
    osc.start();
  }
});

export default socket;
