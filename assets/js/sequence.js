import { sequencer } from "./ui";
import { Synth, DuoSynth, MembraneSynth, PluckSynth, NoiseSynth, Sequence } from 'Tone';

const synth1 = new DuoSynth().toMaster();
synth1.triggerAttackRelease("C4", "16n");

const synth2 = new MembraneSynth().toMaster();
synth2.triggerAttackRelease("C2", "8n");

const synth3 = new PluckSynth().toMaster();
synth3.triggerAttack("C4");

const synth4 = new PluckSynth({ resonance: 0.9 }).toMaster();
synth4.triggerAttackRelease("G2", "8n");

const loop = new Sequence(function(time, col){
  const column = sequencer.matrix.pattern[0][col];

  for (let i = 0; i < 4; i++){
    if (sequencer.matrix.pattern[i][col] === true){
      //slightly randomized velocities
      const vel = Math.random() * 0.5 + 0.5;
      switch(i) {
      case 0:
        synth1.triggerAttackRelease("C4", "64n", time);
        break;
      case 1:
        synth2.triggerAttackRelease("C2", "64n", time);
        break;
      case 2:
        synth3.triggerAttackRelease("C4", "64n", time);
        break;
      case 3:
        synth4.triggerAttackRelease("G2", "64n", time);
        break;
      };
    }
  }
}, [0, 1, 2, 3, 4, 5, 6, 7 ], "32n");

loop.start();
