import { h } from "hyperapp";
import { Button, Toggle, Sequencer, Slider } from 'NexusUI';

const NxButton = (nxchange) => (
  <div oncreate={ (elem) => new Button(elem).on('change', nxchange) }></div>
);

const NxToggle = (nxchange) => (
  <div oncreate={ (elem) => new Toggle(elem).on('change', nxchange ) }></div>
);

const NxSequencer = (nxchange) => (
  <div oncreate={ (elem) => new Sequencer(elem).on('change', nxchange) }></div>
);

const NxSlider = (nxchange) => (
  <div oncreate={ (elem) => new Slider(elem).on('change', nxchange) }></div>
);

const nxElementFromType = (type, actions) => {
  switch(type) {
  case 'button':
    return NxButton(actions.pushButtonChange);
  case 'sequencer':
    return NxSequencer(actions.pushSequencerChange);
    break;
  case 'slider':
    return NxSlider(actions.pushSliderChange);
  case 'toggle':
    return NxToggle(actions.pushToggleChange);
  default:
    throw `widget type ${type} not supported`;
  }
};

export const view = (state, actions) => {
  return (
    <div>
      {state.instruments.default.map((type) => (
        nxElementFromType(type, actions)
      ))}
    </div>
  );
};
