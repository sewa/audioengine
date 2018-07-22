import {
  DuoSynth,
  MembraneSynth,
  PluckSynth,
  Sequence,
  OmniOscillator,
  AmplitudeEnvelope,
  Transport,
} from 'Tone';

const osc = new OmniOscillator("C#4", "pwm");
const env = new AmplitudeEnvelope();
osc.connect(env);
env.toMaster();
osc.start();

const synth1 = new DuoSynth().toMaster();
synth1.triggerAttackRelease("C4", "16n");

const synth2 = new MembraneSynth().toMaster();
synth2.triggerAttackRelease("C2", "8n");

const synth3 = new PluckSynth().toMaster();
synth3.triggerAttack("C4");

const synth4 = new PluckSynth({ resonance: 0.9 }).toMaster();
synth4.triggerAttackRelease("G2", "8n");

const sequenceLoop = ({ actions, instance, nxOptions }) => {
  const seq = new Sequence((time, col) => {
    instance.next();

    for (let i = 0; i < instance.rows; i++){
      if (instance.matrix.pattern[i][col] === true){
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
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
  return seq;
};

const initTone = ({ timestamp, bpm, nowUnix }) => {
  const intervalMs = 60000 / bpm
  const diff       = nowUnix - timestamp
  const error      = diff % intervalMs
  const offset     = intervalMs - error

  window.setTimeout(() => {
    console.log(offset)
    Transport.bpm.value = bpm
    Transport.start()
  }, offset)
};

export {
  osc,
  env,
  sequenceLoop,
  initTone
}
