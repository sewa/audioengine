import { h } from "hyperapp";
import { Button, Toggle, Sequencer, Slider } from 'NexusUI';

import { sequenceLoop } from '../tone';
import { addNxInstance } from '../actions';

const NxButton = ({ key, nxChange, nxOptions }) => (
  <div
    oncreate={ (elem) => {
      const instance = new Button(elem, nxOptions).on('change', (value) => {
        nxChange({ value, key });
      });
      addNxInstance({ key, instance });
    } }>
  </div>
);

const NxToggle = ({ key, nxChange, nxOptions }) => (
  <div
    oncreate={ (elem) => {
      const instance = new Toggle(elem, nxOptions).on('change', (value) => {
        nxChange({ value, key });
      });
      addNxInstance({ key, instance });
    } }>
  </div>
);

const NxSequencer = ({ key, nxChange, nxOptions }) => (
  <div
    oncreate={ (elem) => {
      const instance = new Sequencer(elem, nxOptions).on('change', (value) => {
        nxChange({ value, key });
      });
      const loop = sequenceLoop(instance);
      loop.start();
      addNxInstance({ key, instance });
    } }>
  </div>
);

const NxSlider = ({ key, nxChange, nxOptions }) => (
  <div
    oncreate={ (elem) => {
      const instance = new Slider(elem, nxOptions).on('change', (value) => {
        nxChange({ value, key });
      });
      addNxInstance({ key, instance });
    } }>
  </div>
);

const nxElementFromType = ({ key, item, actions }) => {
  switch(item.type) {
  case 'button':
    return NxButton({
      key:       key,
      nxChange:  actions.instruments.pushChange,
      nxOptions: item.options
    });
  case 'sequencer':
    return NxSequencer({
      key:       key,
      nxChange:  actions.instruments.pushChange,
      nxOptions: item.options
    });
    break;
  case 'slider':
    return NxSlider({
      key:       key,
      nxChange:  actions.instruments.pushChange,
      nxOptions: item.options
    });
  case 'toggle':
    return NxToggle({
      key:       key,
      nxChange:  actions.instruments.pushChange,
      nxOptions: item.options
    });
  default:
    throw `widget type ${item.type} not supported`;
  }
};

export const view = (state, actions) => {
  return (
    <div>
      {Object.keys(state.instruments.default).map((key) => (
        nxElementFromType({
          key: key,
          item: state.instruments.default[key],
          actions: actions
        })
      ))}
    </div>
  );
};
