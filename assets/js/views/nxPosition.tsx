import { h } from "hyperapp"
import { Position } from 'NexusUI'
import { Transport } from 'Tone'

import { Actions } from "../actions";
import { State } from "../state";

const nxOptions = () => (
  {
    size: [50, 200]
  }
)

const barsBeatsSixteenths = ():Array<number> => (
  Transport.position.split(':').map((string) => Number(string))
)

const colIndexFromTransportPosition = ():number => {
  const pos = barsBeatsSixteenths()
  return pos[1] * 4 + (Math.ceil(pos[2]) - 1)
}

const onUpdate = ({ state, sequencer, key, rowIdx }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[`${sequencer.key}-live-${rowIdx}`]
  nxInstance._x.update(elemState.x)
  nxInstance._y.update(elemState.y)
  nxInstance.render()
  const nxSequencer = state.nxInstances[sequencer.key]
  nxSequencer.matrix.set.cell(elemState.colIdx, elemState.rowIdx, elemState.cellState)
}

const onCreate = ({ actions, elem, sequencer, key, rowIdx }) => {
  const instance = new Position(elem, nxOptions())
  instance.on('change', (elemState) => {
    const { x, y }  = elemState
    actions.channels.pushChange({
      elemKey: key,
      elemState: {
        x,
        y,
        rowIdx,
        colIdx: colIndexFromTransportPosition(),
        cellState: true
      }
    })
  })
  instance.move = () => {
    if (instance.clicked) {
      instance.position.y.update(instance.mouse);
      instance._y.updateNormal( instance.position.y.value );
      instance.emit('change',{
        x: instance._x.value,
        y: instance._y.value
      });
      instance.render();
    }
  }
  actions.nxInstances.add({ key, instance })
}

export const NxPosition = ({ sequencer, key, rowIdx }) => (state:State, actions:Actions) => (
  <div style={{ float: 'left', marginRight: '1px' }}
    onupdate = { (elem) => onUpdate({ state, sequencer, key, rowIdx })}
    oncreate = { (elem) => onCreate({ actions, elem, sequencer, key, rowIdx }) }>
  </div>
)
