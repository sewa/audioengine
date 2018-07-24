import {
  AmplitudeEnvelope,
  Master,
  Player,
  Sequence,
  Transport,
  AutoFilter,
  Phaser,
  PitchShift,
  Vibrato,
  Chorus,
  PingPongDelay,
  BitCrusher
} from 'Tone'

const startToneWithOffset = ({ timestamp, bpm, nowUnix }) => {
  const intervalMs = 60000 / bpm
  const diff       = nowUnix - timestamp
  const error      = diff % intervalMs
  const offset     = intervalMs - error

  window.setTimeout(() => {
    Transport.bpm.value = bpm
    Transport.start()
  }, offset)
}

const initSequence = ({ instrument, actions, state }) => {
  const players = createPlayers(instrument)
  const seq = new Sequence((time, sequenceIdx) => {
    actions.playStep({ players, time, sequenceIdx })
    actions.sequencerNext()
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
  seq.start()
}

const createEffects = (effects:Array<string>):{ [effect:string]: any } => {
  let ret = {}
  effects.forEach((effect) => {
    switch(effect) {
      case 'filter':
        ret[effect] = new AutoFilter(8, 200, 3)
        break;
      case 'delay':
        ret[effect] = new PingPongDelay("16n", 0.6)
        break;
      case 'distortion':
        ret[effect] = new BitCrusher(4)
        break;
      case 'pitch':
        ret[effect] = new PitchShift(-3)
        break;
      case 'vibrato':
        ret[effect] = new Vibrato(10, 0.8)
        break;
      case 'chorus':
        ret[effect] = new Chorus(10, 1, 0.8)
        break;
      case 'phaser':
        ret[effect] = new Phaser(10, 3, 800)
        break;
    }
  })
  return ret
}

const createPlayers = (instrument) => (
  instrument.samples.map((sample) => {
    const effects = createEffects(instrument.effects)

    const envelope = new AmplitudeEnvelope({
      "attack": 0.1,
      "decay": 0.2,
      "sustain": 1.0,
      "release": 0.1
    }).chain(...Object.values(effects), Master)

    const player = new Player({
      url:          sample,
      loop:         false,
      retrigger:    true,
      playbackRate: 1.0,
      fadeIn:       0.005,
      fadeOut:      0.005
    }).connect(envelope)

    return {
      envelope,
      player,
      effects: effects
    }
  })
)

export {
  startToneWithOffset,
  initSequence
}
