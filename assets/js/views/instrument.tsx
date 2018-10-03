import { h } from "hyperapp"
import { Actions } from '../actions'
import {
  State,
  InstrumentState
} from '../state'

import {
  shouldDisplayView,
  shouldDisplayEffect,
  sequencerCellSize,
  sequencerHeight,
  sequencerWidth,
  effectViewTriggerKey,
  liveViewTriggerKey,
  effectViewSequencerKey
} from '../helpers'

import { NxPosition } from './nxPosition'
import { NxSequencer } from './nxSequencer'
import { NxToggle } from './nxToggle'

const EditView = (actions:Actions, state:State, instrument:InstrumentState) => {
  let effectViewTrigger = []
  for(let i = 0; i < instrument.samples.length; i++) {
    effectViewTrigger.push(
      <NxToggle
        key={ effectViewTriggerKey(instrument.key, i) }
        effectIdx={ i }
        nxOptions={
          {
            size: [sequencerCellSize, sequencerCellSize]
          }
        }
        onClick={() => {
            actions.setInstrumentView('fxTrigger')
            actions.setEffectView(i)
            /* widgetCtrls.forEach((widget) => {
             *   const nxInstance = state.nxInstances[widget.key]
             *   nxInstance._state.flip(false)
             *   nxInstance.render()
             * }) */
        }}
      />
    )
  }
  return (
    <div style={{ display: shouldDisplayView(state, 'edit') ? 'block' : 'none' }}>
      <div style={{ float: 'left' }}>
        { effectViewTrigger }
      </div>
      <div style={{ float: 'left' }}>
        <NxSequencer
          key={instrument.key}
          nxOptions={
            {
              size:    [sequencerWidth(instrument), sequencerHeight(instrument)],
              mode:    'toggle',
              rows:    instrument.samples.length,
              columns: instrument.columns
            }
          }
        />
      </div>
    </div>
  )
}

const LiveView = (actions:Actions, state:State, instrument:InstrumentState) => {
  let buttons = []
  for(let i = 0; i < instrument.samples.length; i++) {
    buttons.push(
      <div style={{ float: 'left' }}>
        <NxPosition
          key={ liveViewTriggerKey(instrument.key, i) }
          instrument={instrument} rowIdx={i}
        />
      </div>
    )
  }
  return (
    <div style={{ display: shouldDisplayView(state, 'live') ? 'block' : 'none' }}>
      { buttons }
    </div>
  )
}

const EffectView = (actions:Actions, state:State, instrument:InstrumentState) => {
  let effects = []
  for(let i = 0; i < instrument.samples.length; i++) {
    const sampleEffects = instrument.effects.map((effect) => (
      <div>
        <span class="badge badge-pill badge-info">
          { effect }
        </span>
        <NxSequencer
          key={ effectViewSequencerKey(instrument.key, effect, i) }
          nxOptions={
            {
              size:    [sequencerWidth(instrument), sequencerCellSize],
              mode:    'toggle',
              rows:    1,
              columns: instrument.columns
            }
          }
        />
      </div>
    ))
    effects.push(
      <div style={{ display: shouldDisplayEffect(state, i) ? 'block' : 'none' }}>
        { sampleEffects }
      </div>
    )
  }
  return (
    <div style={{ display: shouldDisplayView(state, 'fxTrigger') ? 'block' : 'none' }}>
      { effects }
    </div>
  )
}

export const view = (state:State, actions:Actions) => (
  <div>
    {state.instruments.map((instrument) => (
      [
        EditView(actions, state, instrument),
        LiveView(actions, state, instrument),
        EffectView(actions, state, instrument)
      ]
    ))}
  </div>
)
