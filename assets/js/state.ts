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
export type NxUpdate = NxButtonUpdate | NxSliderUpdate | NxSequencerUpdate | NxToggleUpdate | NxBlankUpdateProp

export type ChannelStateType = {
  [index:string]: {
    channel: Channel
    update: {
      elemKey:   string
      elemState: NxUpdate
    }
  }
}

export type InstrumentWidgetStateType = {
  key: string
  type: string
  nxOptions: {}
}

export type InstrumentStateType = {
  name: string
  edit_view: InstrumentWidgetStateType
  live_view: InstrumentWidgetStateType
}
export type InstrumentsStateType = Array<InstrumentStateType>
const instruments:InstrumentsStateType = [
  {
    name: 'instrument 1',
    edit_view: {
      key: 'sequencer1',
      type: 'sequencer',
      nxOptions: {
        size: [400,200],
        mode: 'toggle',
        rows: 5,
        columns: 8
      }
    },
    live_view: {
      key: 'button1',
      type: 'button',
      nxOptions: {}
    }
  },
  {
    name: 'instrument 2',
    edit_view: {
      key: 'sequencer2',
      type: 'sequencer',
      nxOptions: {
        size: [400,200],
        mode: 'toggle',
        rows: 5,
        columns: 8
      }
    },
    live_view: {
      key: 'button2',
      type: 'button',
      nxOptions: {}
    }
  }
]

export type StateType = {
  channels: ChannelStateType
  nxInstances: {}
  instruments: InstrumentsStateType
  viewType: 'edit' | 'live'
}
const createState = (socket:Socket):StateType => (
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
    viewType: 'edit'
  }
)

export { createState }
