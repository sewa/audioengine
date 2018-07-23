import { h } from "hyperapp"
import { Toggle } from 'NexusUI'

import { Actions } from "../actions";
import { State } from "../state";

const nxOptions = () => (
  {
    size: [30, 25]
  }
)

const onUpdate = ({ state, sequencer: { key } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  nxInstance._state.flip(elemState)
  nxInstance.render()
}

const onCreate = ({ actions, elem, sequencer: { key } }) => {
  const instance = new Toggle(elem, nxOptions()).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

const onClick = ({ actions, state }) => {
  actions.setInstrumentView('fxTrigger')
  /* widgetCtrls.forEach((widget) => {
   *   const nxInstance = state.nxInstances[widget.key]
   *   nxInstance._state.flip(false)
   *   nxInstance.render()
   * }) */
}

export const NxToggle = ({ sequencer, key }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, sequencer })}
    oncreate = { (elem) => onCreate({ actions, elem, sequencer }) }
    onclick  = { (elem) => onClick({ actions, state } )}>
  </div>
)
