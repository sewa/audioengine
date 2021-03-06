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
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

export const NxToggle = ({ key, nxOptions, effectIdx, onClick }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, key })}
    oncreate = { (elem) => onCreate({ actions, elem, key, nxOptions }) }
    onclick  = { (elem) => onClick() }>
  </div>
)
