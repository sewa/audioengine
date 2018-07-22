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
  sequencerReference?: {
    key:    string
    rowIdx: number
  }
  nxOptions: {}
}
export type InstrumentViewStateType = {
  type: 'edit' | 'live' | 'fxTrigger'
  widgets:     Array<InstrumentWidgetStateType>
  widgetCtrls: Array<InstrumentWidgetStateType>
}
export type InstrumentStateType = {
  views: Array<InstrumentViewStateType>
}

export type InstrumentsStateType = Array<InstrumentStateType>
const instruments:InstrumentsStateType = [
  {
    views: [
      {
        type: 'edit',
        widgets: [
          {
            key: 'sequencer1',
            type: 'sequencer',
            nxOptions: {
              size: [400,200],
              mode: 'toggle',
              rows: 8,
              columns: 16
            }
          }
        ],
        widgetCtrls: [0,1,2,3,4,5,6,7].map((idx) => (
          {
            key: `toggle${idx}`,
            type: 'toggle',
            sequencerReference: {
              key:    'sequencer1',
              rowIdx: idx
            },
            nxOptions: {
              size: [30, 25]
            }
          }
        ))
      }, {
        type: 'live',
        widgets: [0,1,2,3,4,5,6,7].map((idx) => (
          {
            key: `position${idx}`,
            type: 'position',
            sequencerReference: {
              key:    'sequencer1',
              rowIdx: idx
            },
            nxOptions: {
              size: [50, 200]
            }
          }
        )),
        widgetCtrls: []
      }, {
        type: 'fxTrigger',
        widgets: [
          {
            key: 'sequencer2',
            type: 'sequencer',
            nxOptions: {
              size: [400,30],
              mode: 'toggle',
              rows: 1,
              columns: 16
            }
          }
        ],
        widgetCtrls: []
      }
    ]
  },
]

export type StateType = {
  channels: ChannelStateType
  nxInstances: {}
  instruments: InstrumentsStateType
  selectedInstrumentView: 'edit' | 'live' | 'fxTrigger'
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
    selectedInstrumentView: 'edit'
  }
)

export { createState }
