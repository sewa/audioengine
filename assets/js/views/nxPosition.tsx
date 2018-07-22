import { h } from "hyperapp"
import { Position } from 'NexusUI'
import { Transport } from 'Tone'

const barsBeatsSixteenths = ():Array<number> => (
  Transport.position.split(':').map((string) => Number(string))
)

const colIndexFromTransportPosition = ():number => {
  const pos = barsBeatsSixteenths()
  return pos[1] * 4 + (Math.ceil(pos[2]) - 1)
}

const onUpdate = ({ state, widget: { key, sequencerReference } }) => {
  const { elemKey, elemState } = state.channels.control.update
  if (key !== elemKey) return
  const nxInstance = state.nxInstances[key]
  nxInstance._x.update(elemState.x)
  nxInstance._y.update(elemState.y)
  nxInstance.render()
  const sequencer = state.nxInstances[sequencerReference.key]
  sequencer.matrix.set.cell(elemState.colIdx, elemState.rowIdx, elemState.cellState)
}

const onCreate = ({ actions, elem, widget: { nxOptions, key, sequencerReference: { rowIdx } } }) => {
  const instance = new Position(elem, nxOptions)
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

export const NxPosition = ({ actions, state, widget }) => (
  <div style={{ float: 'left', marginRight: '1px' }}
    onupdate = { (elem) => onUpdate({ state, widget })}
    oncreate = { (elem) => onCreate({ actions, elem, widget }) }>
  </div>
)
