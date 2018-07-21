import { h } from "hyperapp"
import { view as instrumentView } from './instrument'
import { ActionsType } from '../actions'
import { StateType } from '../state'

export const view = (state:StateType, actions:ActionsType) => (
  <div class="container">
    <div class="row">
      <h1>Webseq</h1>
    </div>
    <div class="row">
      <div class="col">
        { instrumentView(state, actions) }
      </div>
      <div class="col">
        <button class="btn btn-primary" onclick={ () => actions.toggleViewType() }>Toggle view</button>
      </div>
    </div>
  </div>
)
