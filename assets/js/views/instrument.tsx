import { h } from "hyperapp"
import { Button, Toggle, Sequencer, Slider } from 'NexusUI'

import { sequenceLoop, env, osc }    from '../tone'
import { ActionsType } from '../actions'
import {
  StateType,
  InstrumentWidgetStateType,
  InstrumentStateType,
  NxButtonUpdate,
  NxToggleUpdate,
  NxSequencerUpdate,
  NxSliderUpdate
} from '../state'

const onUpdate = ({ state, key, callback }: { state:StateType, key:string, callback:Function}) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  callback({ nxInstance, elemState })
}

type NxElemProps = {
  actions: ActionsType
  key: string
  nxOptions: {}
  state: StateType
}
const NxButton = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        onUpdate({
          state,
          key,
          callback: ({ nxInstance, elemState }: { nxInstance:Button, elemState:NxButtonUpdate }) => {
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
        })
    }}
    oncreate={ (elem) => {
        const instance = new Button(elem, nxOptions).on('change', (elemState) => {
          actions.channels.pushChange({ elemKey: key, elemState })
        })
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

const NxToggle = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        onUpdate({
          state,
          key,
          callback: ({ nxInstance, elemState }: { nxInstance:Toggle, elemState:NxToggleUpdate }) => {
            nxInstance._state.flip(elemState)
            nxInstance.render()
          }
        })
    }}
    oncreate = { (elem) => {
        const instance = new Toggle(elem, nxOptions).on('change', (elemState) => {
          actions.channels.pushChange({ elemKey: key, elemState })
        })
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

const NxSequencer = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        onUpdate({
          state,
          key,
          callback: ({ nxInstance, elemState }: { nxInstance:Sequencer, elemState:NxSequencerUpdate }) => {
            const { row, column } = elemState
            nxInstance.matrix.pattern[row][column] = elemState.state
            nxInstance.update()
          }
        })
    }}
    oncreate={ (elem) => {
        const instance = new Sequencer(elem, nxOptions).on('change', (elemState) => {
          actions.channels.pushChange({ elemKey: key, elemState })
        })
        sequenceLoop({ instance, nxOptions }).start()
        actions.nxInstances.add({ key, instance })
    } }>
  </div>
)

const NxSlider = ({ actions, key, nxOptions, state }:NxElemProps) => (
  <div
    onupdate = { (elem) => {
        onUpdate({
          state,
          key,
          callback: ({ nxInstance, elemState }: { nxInstance:Slider, elemState:NxSliderUpdate }) => {
            nxInstance._elemState.update(elemState)
            nxInstance.position.elemState = nxInstance._elemState.normalized
            nxInstance.render()
            osc.frequency.elemState = elemState * 500
          }
        })
    }}
    oncreate={ (elem) => {
        const instance = new Slider(elem, nxOptions).on('change', (elemState) => {
          actions.channels.pushChange({ elemKey: key, elemState })
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
