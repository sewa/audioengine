import { Channel, Socket } from 'phoenix'

export type NxButtonUpdateProps = {
  kind: 'button'
  value: {
    x: number
    y: number
    state: boolean
  }
}
export type NxSliderUpdateProps = {
  kind: 'slider'
  value: number
}
export type NxSequencerUpdateProps = {
  kind: 'sequencer'
  value: {
    column: number
    row:    number
    state:  boolean
  }
}
export type NxToggleUpdateProps = {
  kind: 'toggle'
  value: boolean
}
export type NxBlankUpdateProps = {
  kind: 'blank'
  value: -1
}
export type NxUpdateProps = NxButtonUpdateProps | NxSliderUpdateProps | NxSequencerUpdateProps | NxToggleUpdateProps | NxBlankUpdateProps

export type ChannelStateType = {
  [index:string]: {
    channel: Channel
    update: {
      elemKey:   string
      elemState: NxUpdateProps
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
          elemState: {
            kind: 'blank',
            value: -1
          } as NxBlankUpdateProps
        }
      },
    },
    nxInstances: {},
    instruments: instruments
  }
)

export { createState }
