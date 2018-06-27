import { Channel, Socket } from 'phoenix'

export type NxButtonUpdateProps = {
  x: number
  y: number
  state: boolean
}
export type NxSliderUpdateProps = number
export type NxSequencerUpdateProps = {
  column: number
  row:    number
  state:  boolean
}
export type NxToggleUpdateProps = boolean

export type ChannelStateType = {
  control: {
    channel: Channel
    update: {
      key:   string
      value: {}
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
  }
]

const createState = (socket:Socket):StateType => (
  {
    channels: {
      control: {
        channel: socket.channel(`channel:control`, {}),
        update: {
          key: '',
          value: {}
        }
      },
    },
    nxInstances: {},
    instruments: instruments
  }
)

export { createState }
