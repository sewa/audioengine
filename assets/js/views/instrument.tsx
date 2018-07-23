import { h } from "hyperapp"
import { Actions } from '../actions'
import {
  State,
  /* View, */
  InstrumentState
} from '../state'

/* import { NxButton } from './nxButton' */
import { NxPosition } from './nxPosition'
import { NxSequencer } from './nxSequencer'
/* import { NxSlider } from './nxSlider' */
import { NxToggle } from './nxToggle'

/* const nxElementFrom = ({ actions, state, view, widget }) => {
 *   const { type } = widget
 *   switch(type) {
 *     case 'button':
 *       return NxButton({ actions, state, widget })
 *     case 'sequencer':
 *       return NxSequencer({ actions, state, widget })
 *     case 'slider':
 *       return NxSlider({ actions, state, widget })
 *     case 'toggle':
 *       return NxToggle({ actions, state, view, widget })
 *     case 'position':
 *       return NxPosition({ actions, state, widget })
 *     default:
 *       throw `widget type ${type} not supported`
 *   }
 * } */
/* 
 * 
 * const nxElementLabel = ({ widget: { label } }) => {
 *   if (label) {
 *     return (
 *       <span class="badge badge-pill badge-info">
 *         { label }
 *       </span>
 *     )
 *   } else {
 *     return ''
 *   }
 * } */
/* 
 * const nxElement = ({ actions, state, view, widget }) => (
 *   // TODO: add a style property to each widget?
 *   <div style={{ float: 'left', marginRight: '1px' }}>
 *     { nxElementLabel({ widget }) }
 *     { nxElementFrom({ actions, state, view, widget }) }
 *   </div>
 * )
 * 
 * const InstrumentView = ({ actions, state, view }) => (
 *   <div style={{ display: shouldDisplayView(state, 'edit') ? 'block' : 'none' }}>
 *     <div style={{ float: 'left' }}>
 *       {view.widgetCtrls.map((widget) => (
 *         nxElementFrom({ actions, state, view, widget })
 *       ))}
 *     </div>
 *     <div style={{ float: 'left' }}>
 *       {view.widgets.map((widget) => (
 *         nxElement({ actions, state, view, widget })
 *       ))}
 *     </div>
 *   </div>
 * )
 *  */

const shouldDisplayView = (state:State, view:string) => (
  state.selectedInstrumentView === view
)

const EditView = (actions:Actions, state:State, instrument:InstrumentState) => {
  const sequencer = instrument.sequencer
  let effectViewTrigger = []
  for(let i = 0; i < sequencer.samples.length; i++) {
    effectViewTrigger.push(<NxToggle key={`${sequencer.key}-toggle-${i}`} sequencer={sequencer} />)
  }
  return (
    <div style={{ display: shouldDisplayView(state, 'edit') ? 'block' : 'none' }}>
      <div style={{ float: 'left' }}>
        { effectViewTrigger }
      </div>
      <div style={{ float: 'left' }}>
        <NxSequencer sequencer={sequencer} />
      </div>
    </div>
  )
}

const LiveView = (actions:Actions, state:State, instrument:InstrumentState) => {
  const sequencer = instrument.sequencer
  let buttons = []
  for(let i = 0; i < sequencer.samples.length; i++) {
    buttons.push(
      <div style={{ float: 'left' }}>
        <NxPosition key={`${sequencer.key}-toggle-${i}`} sequencer={sequencer} rowIdx={i} />
      </div>
    )
  }
  return (
    <div style={{ display: shouldDisplayView(state, 'live') ? 'block' : 'none' }}>
      { buttons }
    </div>
  )
}

export const view = (state:State, actions:Actions) => (
  <div>
    {state.instruments.map((instrument) => (
      [
        EditView(actions, state, instrument),
        LiveView(actions, state, instrument),
      ]
    ))}
  </div>
)
