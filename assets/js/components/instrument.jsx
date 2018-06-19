import { h } from "hyperapp";
import { Button, Toggle, Sequencer, Slider } from 'NexusUI';

import { sequenceLoop, env, osc }   from '../tone';
import { addNxInstance, nxInstances }  from '../actions';

const NxButton = ({ state, key, nxChange, nxOptions }) => (
  <div
    key={key}
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = nxInstances[key];
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
        nxChange({ value, key });
      });
      addNxInstance({ key, instance });
    } }>
  </div>
);

const NxToggle = ({ state, key, nxChange, nxOptions }) => (
  <div
    key={key}
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = nxInstances[key];
      nxInstance._state.flip(value);
      nxInstance.render();
    }}
    oncreate = { (elem) => {
      const instance = new Toggle(elem, nxOptions).on('change', (value) => {
        nxChange({ value, key });
      });
      addNxInstance({ key, instance });
    } }>
  </div>
);

const NxSequencer = ({ state, key, nxChange, nxOptions }) => (
  <div
    key={key}
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = nxInstances[key];
      nxInstance.matrix.pattern[value.row][value.column] = value.state;
      nxInstance.update();
    }}
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

const NxSlider = ({ state, key, nxChange, nxOptions }) => (
  <div
    key={key}
    onupdate = { (elem) => {
      if (key !== state.currentChange.key) return;
      const { value } = state.currentChange;
      const nxInstance = nxInstances[key];
      nxInstance._value.update(value);
      nxInstance.position.value = nxInstance._value.normalized;
      nxInstance.render();
      osc.frequency.value = value * 500;
    }}
    oncreate={ (elem) => {
      const instance = new Slider(elem, nxOptions).on('change', (value) => {
        nxChange({ value, key });
      });
      addNxInstance({ key, instance });
    } }>
  </div>
);

const nxElementFromType = ({ state, key, item, actions }) => {
  switch(item.type) {
  case 'button':
    return NxButton({
      state:     state,
      key:       key,
      nxChange:  actions.pushChange,
      nxOptions: item.options
    });
  case 'sequencer':
    return NxSequencer({
      state:     state,
      key:       key,
      nxChange:  actions.pushChange,
      nxOptions: item.options
    });
    break;
  case 'slider':
    return NxSlider({
      state:     state,
      key:       key,
      nxChange:  actions.pushChange,
      nxOptions: item.options
    });
  case 'toggle':
    return NxToggle({
      state:     state,
      key:       key,
      nxChange:  actions.pushChange,
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
          state: state,
          key: key,
          item: state.instruments.default[key],
          actions: actions
        })
      ))}
    </div>
  );
};
