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
        "./samples/kit_2/1.WAV",
        "./samples/kit_2/2.WAV",
        "./samples/kit_2/3.WAV",
        "./samples/kit_2/4.WAV",
        "./samples/kit_2/5.WAV",
        // "./samples/kit_2/6.WAV",
        // "./samples/kit_2/7.WAV",
        // "./samples/kit_2/8.WAV"
      ],
      columns: 16
    }
  }
  // {
  //   views: {
  //     edit: {
  //     },
  //     live: {
  //       widgets: [0,1,2,3,4,5,6,7].map((idx) => (
  //         {
  //           key: `position${idx}`,
  //           type: 'position',
  //           sequencerReference: {
  //             key:    'sequencer1',
  //             rowIdx: idx
  //           },
  //           nxOptions: {
  //             size: [50, 200]
  //           }
  //         }
  //       )),
  //       widgetCtrls: []
  //     }, {
  //       type: 'fxTrigger',
  //       widgets: availableEffects.map((key, idx) => (
  //         {
  //           key: key,
  //           label: key,
  //           type: 'sequencer',
  //           sequencerReference: {
  //             key:    'sequencer1',
  //             rowIdx: idx
  //           },
  //           nxOptions: {
  //             size: [400,30],
  //             mode: 'toggle',
  //             rows: 1,
  //             columns: 16
  //           }
  //         })),
  //       widgetCtrls: []
  //     }
  //   ]
  // },
]

export type View = 'edit' | 'live' | 'fxTrigger'
export type State = {
  channels: ChannelState
  nxInstances: {}
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
    instruments: instruments,
    selectedInstrumentView: 'edit',
    selectedEffectView: 0
  }
)

export { createState }
