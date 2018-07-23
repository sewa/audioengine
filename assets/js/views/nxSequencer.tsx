import { h } from "hyperapp"
import { Sequencer } from 'NexusUI'

import { Actions } from "../actions";
import {
  State,
  InstrumentSequencerState
} from "../state";

const nxOptions = (sequencer:InstrumentSequencerState) => (
  {
    size:    [400,200],
    mode:    'toggle',
    rows:    sequencer.samples.length,
    columns: sequencer.columns
  }
)

const onUpdate = ({ state, sequencer: { key } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const { row, column } = elemState
  const nxInstance = state.nxInstances[key]
  nxInstance.matrix.pattern[row][column] = elemState.state
  nxInstance.update()
}

const onCreate = ({ actions, elem, state, sequencer }) => {
  const { key } = sequencer
  const instance = new Sequencer(elem, nxOptions(sequencer)).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

export const NxSequencer = ({ sequencer }) => (state:State, actions:Actions) => (
  <div
    onupdate = { (elem) => onUpdate({ state, sequencer })}
    oncreate = { (elem) => onCreate({ actions, elem, state, sequencer }) }>
  </div>
)
