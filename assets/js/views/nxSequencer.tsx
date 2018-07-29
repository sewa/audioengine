import { h } from "hyperapp"
import { Sequencer } from 'NexusUI'

import { Actions } from "../actions";
import { State } from "../state";

const onUpdate = ({ state, key }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const { row, column } = elemState
  const nxInstance = state.nxInstances[key]
  nxInstance.matrix.pattern[row][column] = elemState.state
  nxInstance.update()
}

const onCreate = ({ actions, elem, key, nxOptions, state }) => {
  const instance = new Sequencer(elem, nxOptions).on('change', (elemState) => {
    instance.colorize("fill", nxOptions.fillColor)
    instance.colorize("accent", nxOptions.accentColor)
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
  actions.addNxSequencer(instance)
}

export const NxSequencer = ({ key, nxOptions }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, key })}
    oncreate = { (elem) => onCreate({ actions, elem, key, nxOptions, state }) }>
  </div>
)
