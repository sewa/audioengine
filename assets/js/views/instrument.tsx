import { h } from "hyperapp"
import { Actions } from '../actions'
import {
  State,
  InstrumentState
} from '../state'

import { NxPosition } from './nxPosition'
import { NxSequencer } from './nxSequencer'
import { NxToggle } from './nxToggle'

const shouldDisplayView = (state:State, view:string) => (
  state.selectedInstrumentView === view
)

const shouldDisplayEffect = (state:State, view:number) => (
  state.selectedEffectView === view
)

const EditView = (actions:Actions, state:State, instrument:InstrumentState) => {
  const sequencer = instrument.sequencer
  let effectViewTrigger = []
  for(let i = 0; i < sequencer.samples.length; i++) {
    effectViewTrigger.push(
      <NxToggle
        key={`${sequencer.key}-toggle-${i}`}
        effectIdx={ i }
        nxOptions={
          {
            size: [30, 40]
          }
        }
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
          key={sequencer.key}
          nxOptions={
            {
              size:    [400,200],
              mode:    'toggle',
              rows:    sequencer.samples.length,
              columns: sequencer.columns
            }
          }
          sequencer={sequencer}
        />
      </div>
    </div>
  )
}

const LiveView = (actions:Actions, state:State, instrument:InstrumentState) => {
  const sequencer = instrument.sequencer
  let buttons = []
  for(let i = 0; i < sequencer.samples.length; i++) {
    buttons.push(
      <div style={{ float: 'left' }}>
        <NxPosition
          key={`${sequencer.key}-live-${i}`}
          sequencer={sequencer} rowIdx={i}
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
  const sequencer = instrument.sequencer
  let effects = []
  for(let i = 0; i < sequencer.samples.length; i++) {
    const sampleEffects = sequencer.effects.map((effect) => (
      <div>
        <span class="badge badge-pill badge-info">
          { effect }
        </span>
        <NxSequencer
          key={`${sequencer.key}-effect-${effect}-${i}`}
          nxOptions={
            {
              size:    [400,30],
              mode:    'toggle',
              rows:    1,
              columns: sequencer.columns
            }
          }
          sequencer={sequencer}
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
