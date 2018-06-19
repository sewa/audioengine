const state = {
  channels: {},
  instruments: {
    default: {
      toggle1: {
        type: 'toggle',
        options: {
          state: true
        }
      },
      toggle2: {
        type: 'toggle',
        options: {
          state: false
        }
      },
      button1: {
        type: 'button'
      },
      slider1: {
        type: 'slider'
      },
      sequencer1: {
        type: 'sequencer',
        options: {
          size: [400,200],
          mode: 'toggle',
          rows: 5,
          columns: 8
        }
      },
    }
  }
};

export { state }
