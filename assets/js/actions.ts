import { Channel } from 'phoenix'
import { ActionResult } from 'hyperapp';
import { get } from './service';
import { initTone } from './tone';
import { StateType, ChannelStateType, NxUpdateProps } from './state';

type ChannelPushProps = {
  elemKey: string
  elemState: NxUpdateProps
}

type ChannelConnectProps = {
  name:    string
  update:  {}
  channel: Channel
}

type ChannelReceiveProps = {
  name:     string
  channel:  Channel
  elemKey:  string
  elemState: NxUpdateProps
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
}

const actions:hyperapp.ActionsType<StateType, ActionsType> = {
  initTone: ():void => {
    get('clock').subscribe((xhr) => {
      initTone(xhr.response);
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
    connected: ({ name, channel, update }:ChannelConnectProps) => (state:ChannelStateType) => (
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
    receiveChange: ({ name, channel, elemKey, elemState }:ChannelReceiveProps) => (state:ChannelStateType) => (
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
};

export {
  actions
};
