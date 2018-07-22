import { h } from "hyperapp"
import { Sequencer } from 'NexusUI'
import { sequenceLoop } from '../tone'

const onUpdate = ({ state, widget: { key } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  const { row, column } = elemState
  nxInstance.matrix.pattern[row][column] = elemState.state
  nxInstance.update()
}

const onCreate = ({ actions, elem, state, widget }) => {
  const { key, nxOptions } = widget
  const instance = new Sequencer(elem, nxOptions).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  sequenceLoop({
    actions,
    nxSequencer: instance,
    widget
  })
  actions.nxInstances.add({ key, instance })
}

export const NxSequencer = ({ actions, state, widget }) => (
  <div
    onupdate = { (elem) => onUpdate({ state, widget })}
    oncreate = { (elem) => onCreate({ actions, elem, state, widget }) }>
  </div>
)
