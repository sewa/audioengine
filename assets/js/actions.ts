import { Channel } from 'phoenix'
import { ActionResult } from 'hyperapp';
import { create as timesync_create } from 'timesync'
import { get } from './service';
import { startToneWithOffset, initSequence } from './tone';
import { State, ChannelState, NxUpdate } from './state';

type ChannelPushProps = {
  elemKey: string
  elemState: NxUpdate
}

type ChannelConnectProps = {
  name:    string
  channel: Channel
  update: {
    elemKey:   string
    elemState: NxUpdate
  }
}

type ChannelReceiveProps = {
  name:     string
  channel:  Channel
  elemKey:  string
  elemState: NxUpdate
}

type ChannelActions = {
  connect:       (name: string) => (state: State) => void
  connected:     ({ name, channel, update }:ChannelConnectProps) => (state: State) => ActionResult<State>
  pushChange:    ({ elemKey, elemState }:ChannelPushProps)  => (state: State) => void
  receiveChange: ({ name, channel, elemKey, elemState }:ChannelReceiveProps) => (state: State) => ActionResult<State>
}

type nxInstancesActions = {
  add(any): {
    [key:string]: any
  }
}

export type Actions = {
  initTone: () => void
  channels: ChannelActions
  nxInstances: nxInstancesActions
  addNxSequencer: (instance) => {}
  setInstrumentView: (selectedInstrumentView:string) => {}
  setEffectView: (selectedEffectView:number) => {}
  sequencerNext: (sequenceIdx:number) => {}
  playStep: (players) => {}
}
const actions:hyperapp.ActionsType<State, Actions> = {
  initTone: () => (state, actions) => {
    const ts = timesync_create({
      server: '/api/timesync',
      interval: null
    })
    ts.sync()
    ts.on('sync', (args) => {
      get('clock').subscribe((xhr) => {
        const { timestamp, bpm } = xhr.response
        startToneWithOffset({ timestamp, bpm, nowUnix: ts.now() })
      })
    })
    const sequencer = state.instruments[0].sequencer
    initSequence({ sequencer, actions, state })
  },
  channels: {
    connect: name => (state:ChannelState, actions:ChannelActions):void => {
      const { control: { channel, update } } = state
      channel.join().receive("ok", resp => {
        actions.connected({ name, channel, update })
      })

      channel.on("update", ({ body: { elemKey, elemState } }) => {
        actions.receiveChange({ name, channel, elemKey, elemState })
      })
    },
    connected: ({ name, channel, update }:ChannelConnectProps) => (state:ChannelState):ChannelState => (
      {
        [name]: {
          channel,
          update
        }
      }
    ),
    pushChange: ({ elemKey, elemState }:ChannelPushProps) => (state:ChannelState):void => {
      const { control: { channel } } = state
      channel.push("update", { body: { elemKey, elemState } })
    },
    receiveChange: ({ name, channel, elemKey, elemState }:ChannelReceiveProps) => (state:ChannelState):ChannelState => (
      {
        [name]: {
          channel,
          update: {
            elemKey,
            elemState
          }
        }
      }
    )
  },
  nxInstances: {
    add: ({ key, instance }) => (state:State) => (
      { [key]: instance }
    )
  },
  addNxSequencer: (instance) => (state:State) => (
    { nxSequencer: [...state.nxSequencer, instance] }
  ),
  setInstrumentView: (selectedInstrumentView:string) => (state:State) => (
    { selectedInstrumentView }
  ),
  setEffectView: (selectedEffectView:number) => (state:State) => (
    { selectedEffectView }
  ),
  sequencerNext: () => (state:State) => {
    state.nxSequencer.forEach((instance) => {
      instance.next()
    })
  },
  playStep: ({ players, time, sequenceIdx }) => (state:State) => {
    const sequencerKey = 'sequencer1'
    const instance = state.nxInstances[sequencerKey]
    for (var i = 0; i < instance.rows; i++) {
      Object.keys(players[i].effects).forEach((key) => {
        const sequencer = state.nxInstances[`${sequencerKey}-effect-${key}-${i}`]
        const effect = players[i].effects[key]
        if (sequencer.matrix.pattern[0][sequenceIdx] === true) {
          effect.wet.exponentialRampTo(1, 0.01)
        }else{
          effect.wet.exponentialRampTo(0, 0.01)
        }
      })
      if (instance.matrix.pattern[i][sequenceIdx] === true) {
        const player   = players[i].player
        const envelope = players[i].envelope
        player.start(time)
        envelope.triggerAttackRelease("4n", time, 0.5)
      }
    }
  }
};

export {
  actions
}
