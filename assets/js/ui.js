import { Button, Toggle, Sequencer, Slider } from 'NexusUI'
import {MonoSynth} from 'Tone'

const init = () => {

  /*
  const sequencer = new Sequencer('#sequencer',{
   'size': [400,200],
   'mode': 'toggle',
   'rows': 5,
   'columns': 10
  })
  */

  
 //var sequencer = new Sequencer('#target');
  const slider = new Slider('#slider');
  const button = new Button('#button');
  const toggle_0 = new Toggle('#toggle_0');
  const toggle_1 = new Toggle('#toggle_1');
  const toggle_2 = new Toggle('#toggle_2');
  const toggle_3 = new Toggle('#toggle_3');

  const monoSynth = new MonoSynth();

  slider.on('change',function(v) {
    console.log('slider: ' + v);
  });

}

export {
  init  
}