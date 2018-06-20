import { h } from "hyperapp";
import { Button, Toggle, Sequencer, Slider } from 'NexusUI';

import { sequenceLoop, env, osc }   from '../tone';

const NxButton = ({ state, key, actions, nxOptions }) => (
  <div
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = state.nxInstances[key];
      nxInstance.position.x = value.x;
      nxInstance.position.y = value.y;
      nxInstance._state.flip(value.state);
      nxInstance.render();
      if (value.state) {
        env.triggerAttack();
      } else {
        env.triggerRelease();
      }
    }}
    oncreate={ (elem) => {
      const instance = new Button(elem, nxOptions).on('change', (value) => {
        actions.pushChange({ value, key });
      });
      actions.nxInstances.add({ key, instance });
    } }>
  </div>
);

const NxToggle = ({ state, key, actions, nxOptions }) => (
  <div
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = state.nxInstances[key];
      nxInstance._state.flip(value);
      nxInstance.render();
    }}
    oncreate = { (elem) => {
      const instance = new Toggle(elem, nxOptions).on('change', (value) => {
        actions.pushChange({ value, key });
      });
      actions.nxInstances.add({ key, instance });
    } }>
  </div>
);

const NxSequencer = ({ state, key, actions, nxOptions }) => (
  <div
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = state.nxInstances[key];
      nxInstance.matrix.pattern[value.row][value.column] = value.state;
      nxInstance.update();
    }}
    oncreate={ (elem) => {
      const instance = new Sequencer(elem, nxOptions).on('change', (value) => {
        actions.pushChange({ value, key });
      });
      const loop = sequenceLoop(instance);
      loop.start();
      actions.nxInstances.add({ key, instance });
    } }>
  </div>
);

const NxSlider = ({ state, key, actions, nxOptions }) => (
  <div
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = state.nxInstances[key];
      nxInstance._value.update(value);
      nxInstance.position.value = nxInstance._value.normalized;
      nxInstance.render();
      osc.frequency.value = value * 500;
    }}
    oncreate={ (elem) => {
      const instance = new Slider(elem, nxOptions).on('change', (value) => {
        actions.pushChange({ value, key });
      });
      actions.nxInstances.add({ key, instance });
    } }>
  </div>
);

const nxElementFromType = ({ state, key, actions }) => {
  const nxOptions = state.instruments.default[key];
  switch(nxOptions.type) {
  case 'button':
    return NxButton({ state, key, actions, nxOptions });
  case 'sequencer':
    return NxSequencer({ state, key, actions, nxOptions });
  case 'slider':
    return NxSlider({ state, key, actions, nxOptions });
  case 'toggle':
    return NxToggle({ state, key, actions, nxOptions });
  default:
    throw `widget type ${nxOptions.type} not supported`;
  }
};

export const view = (state, actions) => {
  return (
    <div>
      {Object.keys(state.instruments.default).map((key) => (
        nxElementFromType({ state, key, actions })
      ))}
    </div>
  );
};
