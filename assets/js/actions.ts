import { Channel } from 'phoenix'
import { ActionResult } from 'hyperapp';
import { create as timesync_create } from 'timesync'
import { get } from './service';
import { startToneWithOffset, initSequence } from './tone';
import { StateType, ChannelStateType, NxUpdate } from './state';

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

type ChannelActionsType = {
  connect:       (name: string) => (state: StateType) => void
  connected:     ({ name, channel, update }:ChannelConnectProps) => (state: StateType) => ActionResult<StateType>
  pushChange:    ({ elemKey, elemState }:ChannelPushProps)  => (state: StateType) => void
  receiveChange: ({ name, channel, elemKey, elemState }:ChannelReceiveProps) => (state: StateType) => ActionResult<StateType>
}

type nxInstancesActionsType = {
  add(any): {
    [key:string]: any
  }
}

export type ActionsType = {
  initTone: () => void
  channels: ChannelActionsType
  nxInstances: nxInstancesActionsType
  setInstrumentView: (selectedInstrumentView:string) => {}
  sequencerNext: (sequenceIdx:number) => {}
  playStep: (players) => {}
}
const actions:hyperapp.ActionsType<StateType, ActionsType> = {
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
    const widget = state.instruments[0].views[0].widgets[0]
    initSequence({ widget, actions, state })
  },
  channels: {
    connect: name => (state:ChannelStateType, actions:ChannelActionsType):void => {
      const { control: { channel, update } } = state
      channel.join().receive("ok", resp => {
        actions.connected({ name, channel, update })
      })

      channel.on("update", ({ body: { elemKey, elemState } }) => {
        actions.receiveChange({ name, channel, elemKey, elemState })
      })
    },
    connected: ({ name, channel, update }:ChannelConnectProps) => (state:ChannelStateType):ChannelStateType => (
      {
        [name]: {
          channel,
          update
        }
      }
    ),
    pushChange: ({ elemKey, elemState }:ChannelPushProps) => (state:ChannelStateType):void => {
      const { control: { channel } } = state
      channel.push("update", { body: { elemKey, elemState } })
    },
    receiveChange: ({ name, channel, elemKey, elemState }:ChannelReceiveProps) => (state:ChannelStateType):ChannelStateType => (
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
    add: ({ key, instance }) => (state:StateType) => (
      { [key]: instance }
    )
  },
  setInstrumentView: (selectedInstrumentView:string) => (state:StateType) => (
    { selectedInstrumentView }
  ),
  sequencerNext: () => (state:StateType) => {
    Object.keys(state.nxInstances).forEach((key) => {
      const instance = state.nxInstances[key]
      if (instance.type === 'Sequencer') {
        instance.next()
      }
    })
  },
  playStep: ({ players, time, sequenceIdx }) => (state:StateType) => {
    const instance = state.nxInstances['sequencer1']
    for (var i = 0; i < instance.rows; i++) {
      Object.keys(players[i].effects).forEach((key) => {
        const sequencer = state.nxInstances[key]
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
        envelope.triggerAttackRelease("4n", time, 1.0)
      }
    }
  }
};

export {
  actions
}
