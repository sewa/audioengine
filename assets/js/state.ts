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
export type InstrumentWidgetsStateType = Array<InstrumentWidgetStateType>

export type InstrumentStateType = {
  name: string,
  widgets: InstrumentWidgetsStateType
}
export type InstrumentsStateType = Array<InstrumentStateType>

export type StateType = {
  channels: ChannelStateType
  nxInstances: {}
  instruments: InstrumentsStateType
}

const instruments:InstrumentsStateType = [
  {
    name: 'default',
    widgets: [
      {
        key: 'toggle1',
        type: 'toggle',
        nxOptions: {
          state: true
        }
      },
      {
        key: 'toggle2',
        type: 'toggle',
        nxOptions: {
          state: false
        }
      },
      {
        key: 'button1',
        type: 'button',
        nxOptions: {}
      },
      {
        key: 'slider1',
        type: 'slider',
        nxOptions: {}
      },
      {
        key: 'sequencer1',
        type: 'sequencer',
        nxOptions: {
          size: [400,200],
          mode: 'toggle',
          rows: 5,
          columns: 8
        }
      },
    ]
  },
  {
    name: 'test',
    widgets: [
      {
        key: 'sequencer2',
        type: 'sequencer',
        nxOptions: {
          size: [400,200],
          mode: 'toggle',
          rows: 5,
          columns: 8
        }
      },
    ]
  }
]

const createState = (socket:Socket):StateType => (
  {
    channels: {
      control: {
        channel: socket.channel(`channel:control`, {}),
        update: {
          elemKey: '',
          elemState: 0 as NxBlankUpdateProp
        }
      },
    },
    nxInstances: {},
    instruments: instruments
  }
)

export { createState }
