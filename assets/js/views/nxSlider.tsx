import { h } from "hyperapp"
import { Slider } from 'NexusUI'

const onUpdate = ({ state, widget: { key } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  nxInstance._elemState.update(elemState)
  nxInstance.position.elemState = nxInstance._elemState.normalized
  nxInstance.render()
}

const onCreate = ({ actions, elem, widget: { key, nxOptions } }) => {
  const instance = new Slider(elem, nxOptions).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

export const NxSlider = ({ actions, state, widget }) => (
  <div
    onupdate = { (elem) => onUpdate({ state, widget })}
    oncreate = { (elem) => onCreate({ actions, elem, widget }) }>
  </div>
)
