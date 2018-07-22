import { h } from "hyperapp"
import { ActionsType } from '../actions'
import { StateType } from '../state'

import { NxButton } from './nxButton'
import { NxPosition } from './nxPosition'
import { NxSequencer } from './nxSequencer'
import { NxSlider } from './nxSlider'
import { NxToggle } from './nxToggle'

const nxElementFromType = ({ actions, state, widget }) => {
  const { type } = widget
  switch(type) {
    case 'button':
      return NxButton({ actions, state, widget })
    case 'sequencer':
      return NxSequencer({ actions, state, widget })
    case 'slider':
      return NxSlider({ actions, state, widget })
    case 'toggle':
      return NxToggle({ actions, state, widget })
    case 'position':
      return NxPosition({ actions, state, widget })
    default:
      throw `widget type ${type} not supported`
  }
}

const shouldDisplayView = ({ state, view }) => (
  state.selectedInstrumentView === view.type
)

const InstrumentView = ({ actions, state, view }) => (
  <div style={{ display: shouldDisplayView({ state, view }) ? 'block' : 'none' }}>
    <div style={{ float: 'left' }}>
      {view.widgetCtrls.map((widget) => (
        nxElementFromType({ actions, state, widget })
      ))}
    </div>
    <div style={{ float: 'left' }}>
      {view.widgets.map((widget) => (
        nxElementFromType({ actions, state, widget })
      ))}
    </div>
  </div>
)

const InstrumentViews = ({ actions, state, instrument }) => (
  <div>
    {instrument.views.map((view) => (
      InstrumentView({ actions, state, view })
    ))}
  </div>
)

export const view = (state:StateType, actions:ActionsType) => (
  <div>
    {state.instruments.map((instrument) => {
      return [
        InstrumentViews({ actions, state, instrument }),
      ]
    })}
  </div>
)
