import { pushChange } from './control_channel';

const state = {
  instruments: {
    default: [
      {
        type: 'toggle',
        options: {
          state: true
        }
      },
      {
        type: 'button'
      },
      {
        type: 'slider'
      },
      {
        type: 'sequencer',
        options: {
          size: [400,200],
          mode: 'toggle',
          rows: 5,
          columns: 8
        }
      },
    ]
  }
};

const actions = {
  pushButtonChange:    value => state =>
    pushChange({ type: 'button', value: value}),
  receiveButtonChange: (elem, value) => state => {
    console.log(elem);
    console.log(value);
    elem.position.x = value.x;
    elem.position.y = value.y;
    elem._state.flip(value.state);
    elem.render();
    if (value.state) {
      env.triggerAttack();
    } else {
      env.triggerRelease();
    }
  },
  pushSequencerChange: value => state =>
    pushChange({ type: 'sequencer', value: value }),
  receiveSequencerChange: (elem, value) => state => {
    elem.matrix.pattern[value.row][value.column] = value.state;
    elem.update();
  },
  pushSliderChange:    value => state =>
    pushChange({ type: 'slider', value: value }),
  receiveSliderChange: (elem, value) => state => {
    elem._value.update(value);
    elem.position.value = elem._value.normalized;
    elem.render();
    osc.frequency.value = value * 500;
  },
  pushToggleChange:    value => state =>
    pushChange({ type: 'toggle', value: value }),
  receiveToggleChange: (elem, value) => state => {
    console.log(elem);
    console.log(value);
    elem._state.flip(value);
    elem.render();
  }
};

export {
  actions,
  state
};
