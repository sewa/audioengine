import { h } from "hyperapp"
import { Toggle } from 'NexusUI'

import { Actions } from "../actions";
import { State } from "../state";

const onUpdate = ({ state, key }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  nxInstance._state.flip(elemState)
  nxInstance.render()
}

const onCreate = ({ actions, elem, key, nxOptions }) => {
  const instance = new Toggle(elem, nxOptions).on('change', (elemState) => {
    instance.colorize("fill","#333")
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

const onClick = ({ actions, state, effectIdx }) => {
  actions.setInstrumentView('fxTrigger')
  actions.setEffectView(effectIdx)
  /* widgetCtrls.forEach((widget) => {
   *   const nxInstance = state.nxInstances[widget.key]
   *   nxInstance._state.flip(false)
   *   nxInstance.render()
   * }) */
}

export const NxToggle = ({ key, nxOptions, effectIdx }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, key })}
    oncreate = { (elem) => onCreate({ actions, elem, key, nxOptions }) }
    onclick  = { (elem) => onClick({ actions, state, effectIdx } )}>
  </div>
)
