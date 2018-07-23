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
  BitCrusher,
  Convolver
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

const initSequence = ({ sequencer, actions, state }) => {
  const players = createPlayers(sequencer)
  const seq = new Sequence((time, sequenceIdx) => {
    actions.playStep({ players, time, sequenceIdx })
    actions.sequencerNext()
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");
  seq.start()
}

const createPlayers = (sequencer) => (
  sequencer.samples.map((sample) => {
    const autoFilter = new AutoFilter(8, 200, 3)
    const phaser     = new Phaser(10, 3, 800)
    const pitchShift = new PitchShift(-3)
    const vibrato    = new Vibrato(10, 0.8)
    const chorus     = new Chorus(10, 1, 0.8)
    const pingPong   = new PingPongDelay("16n", 0.6)
    const bitCrusher = new BitCrusher(4)
    const convolver  = new Convolver("./samples/ir/Terrys Warehouse 1_01.wav")

    const envelope = new AmplitudeEnvelope({
      "attack": 0.1,
      "decay": 0.2,
      "sustain": 1.0,
      "release": 0.1
    }).chain(autoFilter, phaser, pitchShift, vibrato, chorus, pingPong, bitCrusher, convolver, Master)

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
      effects: {
        filter: autoFilter,
        delay: pingPong,
        reverb: convolver,
        distortion: bitCrusher,
        pitch: pitchShift,
        vibrato: vibrato,
        chorus: chorus,
        phaser: phaser
      }
    }
  })
)

export {
  startToneWithOffset,
  initSequence
}
