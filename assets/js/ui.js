import { Button, Toggle, Sequencer, Slider } from 'NexusUI';

var sequencer = new Sequencer('#sequencer',{
  'size': [400,200],
  'mode': 'toggle',
  'rows': 5,
  'columns': 8
});

const elements = {
  slider: {
    elem: new Slider('#slider'),
    type: 'slider'
  },
  button: {
    elem: new Button('#button'),
    type: 'button'
  },
  toggle_0: {
    elem: new Toggle('#toggle_0'),
    type: 'toggle'
  },
  sequencer: {
    elem: sequencer,
    type: 'sequencer'
  },
  toggle_1: {
    elem: new Toggle('#toggle_1'),
    type: 'toggle'
  },
  toggle_2: {
    elem: new Toggle('#toggle_2'),
    type: 'toggle'
  },
  toggle_3: {
    elem: new Toggle('#toggle_3'),
    type: 'toggle'
  }
};


export {
  elements,
  sequencer
}
