import {
  DuoSynth,
  MembraneSynth,
  PluckSynth,
  Sequence,
  OmniOscillator,
  AmplitudeEnvelope,
  Transport,
  AutoFilter,
  Phaser,
  PitchShift,
  Vibrato,
  Chorus,
  PingPongDelay,
  BitCrusher,
  Convolver
} from 'Tone';

const initTone = ({ timestamp, bpm, nowUnix }) => {
  const intervalMs = 60000 / bpm
  const diff       = nowUnix - timestamp
  const error      = diff % intervalMs
  const offset     = intervalMs - error

  window.setTimeout(() => {
    Transport.bpm.value = bpm
    Transport.start()
  }, offset)
}

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

const createEffects = (widget) => {
  const { tone } = widget
  if(tone && tone.samples) {
    return tone.samples.map((sample) => (
      [
        new AutoFilter(8, 200, 3),
        new Phaser(10, 3, 800),
        new PitchShift(-3),
        new Vibrato(10, 0.8),
        new Chorus(10, 1, 0.8),
        new PingPongDelay("16n", 0.6),
        new BitCrusher(4),
        new Convolver("./samples/ir/Terrys Warehouse 1_01.wav")
      ]
    ))
  } else {
    []
  }
}

const sequenceLoop = ({ actions, nxSequencer, widget }) => {
  const seq = new Sequence((time, col) => {
    nxSequencer.next();
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
  seq.start()
};

export {
  osc,
  env,
  createEffects,
  sequenceLoop,
  initTone
}
