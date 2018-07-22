import { h } from "hyperapp"
import { Toggle } from 'NexusUI'

const onUpdate = ({ state, widget: { key } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  nxInstance._state.flip(elemState)
  nxInstance.render()
}

const onCreate = ({ actions, elem, widget: { key, nxOptions } }) => {
  const instance = new Toggle(elem, nxOptions).on('change', (elemState) => {
    actions.channels.pushChange({ elemKey: key, elemState })
  })
  actions.nxInstances.add({ key, instance })
}

const onClick = ({ actions, state, view: { widgetCtrls } }) => {
  actions.setInstrumentView('fxTrigger')
  widgetCtrls.forEach((widget) => {
    const nxInstance = state.nxInstances[widget.key]
    nxInstance._state.flip(false)
    nxInstance.render()
  })
}

export const NxToggle = ({ actions, state, view, widget }) => (
  <div
    onupdate = { (elem) => onUpdate({ state, widget })}
    oncreate = { (elem) => onCreate({ actions, elem, widget }) }
    onclick  = { (elem) => onClick({ actions, state, view } )}>
  </div>
)
