import { h } from "hyperapp";
import { Button, Toggle, Sequencer, Slider } from 'NexusUI';

import { sequenceLoop } from '../tone';

const NxButton = ({ onUpdate, nxChange, nxOptions }) => (
  <div
    onupdate={ onUpdate }
    oncreate={ (elem) => new Button(elem, nxOptions).on('change', nxChange) }>
  </div>
);

const NxToggle = ({ onUpdate, nxChange, nxOptions }) => (
  <div
    onupdate={ onUpdate }
    oncreate={ (elem) => new Toggle(elem, nxOptions).on('change', nxChange ) }>
  </div>
);

const NxSequencer = ({ onUpdate, nxChange, nxOptions }) => (
  <div
    onupdate={ onUpdate }
    oncreate={ (elem) => {
      const seq = new Sequencer(elem, nxOptions).on('change', nxChange);
      const loop = sequenceLoop(seq);
      loop.start();
      return seq;
    } }>
  </div>
);

const NxSlider = ({ onUpdate, nxChange, nxOptions }) => (
  <div
    onupdate={ onUpdate }
    oncreate={ (elem) => new Slider(elem, nxOptions).on('change', nxChange) }>
  </div>
);

const nxElementFromType = (item, actions) => {
  switch(item.type) {
  case 'button':
    return NxButton({
      onUpdate:  actions.receiveButtonChange,
      nxChange:  actions.pushButtonChange,
      nxOptions: item.options
    });
  case 'sequencer':
    return NxSequencer({
      onUpdate:  actions.receiveSequencerChange,
      nxChange:  actions.pushSequencerChange,
      nxOptions: item.options
    });
    break;
  case 'slider':
    return NxSlider({
      onUpdate:  actions.receiveSliderChange,
      nxChange:  actions.pushSliderChange,
      nxOptions: item.options
    });
  case 'toggle':
    return NxToggle({
      onUpdate:  actions.receiveToggleChange,
      nxChange:  actions.pushToggleChange,
      nxOptions: item.options
    });
  default:
    throw `widget type ${item.type} not supported`;
  }
};

export const view = (state, actions) => {
  return (
    <div>
      {state.instruments.default.map((item) => (
        nxElementFromType(item, actions)
      ))}
    </div>
  );
};
