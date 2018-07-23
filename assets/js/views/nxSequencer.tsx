import { h } from "hyperapp"
import { Sequencer } from 'NexusUI'

import { Actions } from "../actions";
import { State } from "../state";

const onUpdate = ({ state, key, sequencer }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const { row, column } = elemState
  const nxInstance = state.nxInstances[key]
  nxInstance.matrix.pattern[row][column] = elemState.state
  nxInstance.update()
}

const onCreate = ({ actions, elem, key, nxOptions, state, sequencer }) => {
  const instance = new Sequencer(elem, nxOptions).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

export const NxSequencer = ({ key, nxOptions, sequencer }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, key, sequencer })}
    oncreate = { (elem) => onCreate({ actions, elem, key, nxOptions, state, sequencer }) }>
  </div>
)
