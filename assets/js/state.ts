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
export type NxUpdate = NxButtonUpdate |
  NxSliderUpdate |
  NxSequencerUpdate |
  NxToggleUpdate |
  NxBlankUpdateProp |
  NxPositionUpdate

export type ChannelState = {
  [index:string]: {
    channel: Channel
    update: {
      elemKey:   string
      elemState: NxUpdate
    }
  }
}

export type InstrumentState = {
  key: string
  columns: number
  effects: Array<string>
  samples: Array<string>
}
export type InstrumentsState = Array<InstrumentState>
export type InstrumentView = 'edit' | 'live' | 'fxTrigger'
export type State = {
  channels: ChannelState
  nxInstances: {}
  nxSequencer: Array<any>
  instruments: InstrumentsState
  selectedInstrumentView: InstrumentView
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
    instruments: [],
    selectedInstrumentView: 'edit',
    selectedEffectView: 0
  }
)

export { createState }
