import { Channel } from 'phoenix'
import { get } from './service';
import { initTone } from './tone';
import { StateType, ChannelStateType } from './state';

type ChannelPushProps = {
  key: string,
  value: {}
}

type ChannelConnectProps = {
  name:    string
  update:  {}
  channel: Channel
}

type ChannelReceiveProps = ChannelPushProps & ChannelConnectProps

type ChannelActionsType = {
  connect(name: string): void
  pushChange(ChannelChange): void
  connected(ChanelConnect): {
    [key:string]: any
  },
  receiveChange(ChannelReceive): {
    [key:string]: any
  }
}

type nxInstancesActionsType = {
  add(any): {
    [key:string]: any
  }
}

export type ActionsType = {
  initTone(): void
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

      channel.on("update", ({ body: { key, value } }) => {
        actions.receiveChange({ name, channel, key, value })
      })
    },
    pushChange: ({ key, value }:ChannelPushProps) => (state:ChannelStateType) => {
      const { control: { channel } } = state
      channel.push("update", { body: { key, value }})
    },
    connected: ({ name, channel, update }:ChannelConnectProps) => (state:ChannelStateType) => (
      { [name]: { channel, update } }
    ),
    receiveChange: ({ name, channel, key, value }:ChannelReceiveProps) => (state:ChannelStateType) => (
      { [name]: { channel, update: { key, value } } }
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
