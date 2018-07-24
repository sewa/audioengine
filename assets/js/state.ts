import { Channel, Socket } from 'phoenix'

export type NxButtonUpdate = {
  x: number
  y: number
  state: boolean
}
export type NxSliderUpdate = number
export type NxSequencerUpdate = {
  column: number
  row:    number
  state:  boolean
}
export type NxToggleUpdate = boolean
export type NxBlankUpdateProp = 0
export type NxPositionUpdate = {
  x:         number
  y:         number
  colIdx:    number
  rowIdx:    number
  cellState: boolean
}
export type NxUpdate = NxButtonUpdate | NxSliderUpdate | NxSequencerUpdate | NxToggleUpdate | NxBlankUpdateProp | NxPositionUpdate

export type ChannelState = {
  [index:string]: {
    channel: Channel
    update: {
      elemKey:   string
      elemState: NxUpdate
    }
  }
}

export type InstrumentSequencerState = {
  key: string
  effects: Array<string>
  samples: Array<string>
  columns: number
}
export type InstrumentState = {
  sequencer: InstrumentSequencerState
}
export type InstrumentsState = Array<InstrumentState>

const availableEffects = [
  'filter',
  'delay',
  'reverb',
  'distortion',
  'pitch',
  'vibrato',
  'chorus',
  'phaser'
]

const instruments:InstrumentsState = [
  {
    sequencer: {
      key: 'sequencer1',
      effects: availableEffects,
      samples: [
        "./samples/kit_1/1.wav",
        "./samples/kit_1/2.wav",
        "./samples/kit_3/5.wav",
        "./samples/kit_1/3.wav",
        //"./samples/kit_3/5.wav",
        //"./samples/kit_2/5.wav",
        // "./samples/kit_2/7.wav",
        // "./samples/kit_2/8.wav"
      ],
      columns: 16
    }
  }
]

export type View = 'edit' | 'live' | 'fxTrigger'
export type State = {
  channels: ChannelState
  nxInstances: {}
  nxSequencer: Array<any>
  instruments: InstrumentsState
  selectedInstrumentView: View
  selectedEffectView: number
}
const createState = (socket:Socket):State => (
  {
    channels: {
      control: {
        channel: socket.channel(`channel:control`, {}),
        update: {
          elemKey: '',
          elemState: 0
        }
      },
    },
    nxInstances: {},
    nxSequencer: [],
    instruments: instruments,
    selectedInstrumentView: 'edit',
    selectedEffectView: 0
  }
)

export { createState }
