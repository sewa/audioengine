import { h } from "hyperapp"
import { Button } from 'NexusUI'

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
  const instance = new Button(elem, nxOptions).on('change', (elemState) => {
    instance.mode = nxOptions.mode
    instance.colorize("fill","#333")
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

const onClick = ({ actions, state, effectIdx }) => {
  actions.setInstrumentView('fxTrigger')
  actions.setEffectView(effectIdx)
}





//export const NxButton = ({ actions, state, widget }) => (
export const NxButton = ({ key, nxOptions, effectIdx }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, key })}
    oncreate = { (elem) => onCreate({ actions, elem, key, nxOptions }) }
    onclick  = { (elem) => onClick({ actions, state, effectIdx } )}>
  </div>
)
