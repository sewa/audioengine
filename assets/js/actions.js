
const state = {
  instruments: {
    default: [
      'toggle',
      'button',
      'slider',
      'sequencer',
    ]
  }
};

const pushChange = ({ type, value }) => console.log(value);

const actions = {
  pushButtonChange:    value => state =>
    pushChange({ type: 'button', value: value}),
  pushSequencerChange: value => state =>
    pushChange({ type: 'sequencer', value: value }),
  pushSliderChange:    value => state =>
    pushChange({ type: 'slider', value: value }),
  pushToggleChange:    value => state =>
    pushChange({ type: 'toggle', value: value }),
};

export {
  actions,
  state
};
