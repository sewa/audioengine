import { Channel } from 'phoenix'
import { ActionResult } from 'hyperapp';
import { create as timesync_create } from 'timesync'
import { get } from './service';
import { initTone } from './tone';
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
}
const actions:hyperapp.ActionsType<StateType, ActionsType> = {
  initTone: ():void => {
    const ts = timesync_create({
      server: '/api/timesync',
      interval: null
    });
    ts.sync()
    ts.on('sync', (args) => {
      get('clock').subscribe((xhr) => {
        const { timestamp, bpm } = xhr.response
        initTone({ timestamp, bpm, nowUnix: ts.now() })
      });
    });
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
  setInstrumentView: (selectedInstrumentView:string) => (state:StateType) => {
    return { selectedInstrumentView }
  },
};

export {
  actions
};
