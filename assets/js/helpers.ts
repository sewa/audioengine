import {
  State,
  InstrumentState
} from './state'

export const shouldDisplayView = (state:State, view:string) => (
  state.selectedInstrumentView === view
)

export const shouldDisplayEffect = (state:State, view:number) => (
  state.selectedEffectView === view
)

export const sequencerCellSize = 35

export const sequencerWidth = (instrument:InstrumentState) => (
  instrument.columns * sequencerCellSize
)

export const sequencerHeight = (instrument:InstrumentState) => (
  instrument.samples.length * sequencerCellSize
)

export const effectViewTriggerKey = (key:string, idx:number) => (
  `${key}-toggle-${idx}`
)

export const liveViewTriggerKey = (key:string, idx:number) => (
  `${key}-live-${idx}`
)

export const effectViewSequencerKey = (key:string, effect:string, idx:number) => (
  `${key}-effect-${effect}-${idx}`
)
