import { h } from "hyperapp"
import { Button } from 'NexusUI'
import { env } from '../tone'

const onUpdate = ({ state, widget: { key } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  nxInstance.position.x = elemState.x
  nxInstance.position.y = elemState.y
  nxInstance._state.flip(elemState.state)
  nxInstance.render()
  if (elemState.state) {
    env.triggerAttack()
  } else {
    env.triggerRelease()
  }
}

const onCreate = ({ actions, elem, widget: { key, nxOptions } }) => {
  const instance = new Button(elem, nxOptions).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

export const NxButton = ({ actions, state, widget }) => (
  <div
    onupdate = { (elem) => onUpdate({ state, widget })}
    oncreate = { (elem) => onCreate({ actions, elem, widget }) }>
  </div>
)
