import { h } from "hyperapp"
import { Button, Toggle, Sequencer, Slider } from 'NexusUI'

import { sequenceLoop, env, osc }    from '../tone'
import { ActionsType } from '../actions'
import {
  StateType,
  InstrumentWidgetStateType,
  InstrumentStateType,
} from '../state'

type NxElemProps = {
  actions: ActionsType
  key: string
  nxOptions: {}
  state: StateType
}
const NxButton = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        const { elemKey, elemState } = state.channels.control.update
        if (key !== elemKey || elemState.kind !== 'button') return // second is a literal type guard
        const { value } = elemState
        const nxInstance = state.nxInstances[key]
        nxInstance.position.x = value.x
        nxInstance.position.y = value.y
        nxInstance._state.flip(value.state)
        nxInstance.render()
        if (value.state) {
          env.triggerAttack()
        } else {
          env.triggerRelease()
        }
    }}
    oncreate={ (elem) => {
        const instance = new Button(elem, nxOptions).on('change', (value) => {
          actions.channels.pushChange({ elemKey: key, elemState: { kind: 'button', value } })
        })
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

const NxToggle = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        const { elemKey, elemState } = state.channels.control.update
        if (key !== elemKey || elemState.kind !== 'toggle') return // second is a literal type guard
        const { value } = elemState
        const nxInstance = state.nxInstances[key]
        nxInstance._state.flip(value)
        nxInstance.render()
    }}
    oncreate = { (elem) => {
        const instance = new Toggle(elem, nxOptions).on('change', (value) => {
          actions.channels.pushChange({ elemKey: key, elemState: { kind: 'toggle', value } })
        })
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

const NxSequencer = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        const { elemKey, elemState } = state.channels.control.update
        if (key !== elemKey || elemState.kind !== 'sequencer') return // second is a literal type guard
        const { value } = elemState
        const nxInstance = state.nxInstances[key]
        const { row, column } = value
        nxInstance.matrix.pattern[row][column] = value.state
        nxInstance.update()
    }}
    oncreate={ (elem) => {
        const instance = new Sequencer(elem, nxOptions).on('change', (value) => {
          actions.channels.pushChange({ elemKey: key, elemState: { kind: 'sequencer', value } })
        })
        sequenceLoop(instance).start()
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

const NxSlider = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        const { elemKey, elemState } = state.channels.control.update
        if (key !== elemKey || elemState.kind !== 'slider') return // second is a literal type guard
        const { value } = elemState
        const nxInstance = state.nxInstances[key]
        nxInstance._value.update(value)
        nxInstance.position.value = nxInstance._value.normalized
        nxInstance.render()
        osc.frequency.value = value * 500
    }}
    oncreate={ (elem) => {
        const instance = new Slider(elem, nxOptions).on('change', (value) => {
          actions.channels.pushChange({ elemKey: key, elemState: { kind: 'slider', value } })
        })
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

type BuildNxElemProps = {
  actions: ActionsType
  state:   StateType
  widget:  InstrumentWidgetStateType
}
const nxElementFromType = ({ actions, state, widget }:BuildNxElemProps) => {
  const { type, key, nxOptions } = widget
  switch(type) {
    case 'button':
      return NxButton({ state, key, actions, nxOptions })
    case 'sequencer':
      return NxSequencer({ state, key, actions, nxOptions })
    case 'slider':
      return NxSlider({ state, key, actions, nxOptions })
    case 'toggle':
      return NxToggle({ state, key, actions, nxOptions })
    default:
      throw `widget type ${type} not supported`
  }
}

type InstrumentProps = {
  actions:    ActionsType
  instrument: InstrumentStateType
  state:      StateType
}
const Instrument = ({ actions, state, instrument }:InstrumentProps) => (
  <fieldset style={{
    border: '1px solid #ccc',
    float:  'left'
  }}>
    <legend style={{
      fontFamily: 'monospace',
      textTransform: 'uppercase'
    }}>
      { instrument.name }
    </legend>
    { instrument.widgets.map((widget) => (
      nxElementFromType({ actions, state, widget })
    )) }
  </fieldset>
)

export const view = (state:StateType, actions:ActionsType) => (
  <div>
    {state.instruments.map((instrument) => (
       Instrument({ state, actions, instrument })
    ))}
  </div>
)
