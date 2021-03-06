import { h } from "hyperapp"
import { view as instrumentView } from './instrument'
import { Actions } from '../actions'
import { State } from '../state'

export const view = (state:State, actions:Actions) => (
  <div class="container" style={{ marginTop: '20px' }}>
    <div class="row">
      <div class="col-2">
        <div class="btn-group-vertical">
          <button class="btn btn-outline-info pull-right" onclick={ () => actions.setInstrumentView('edit') }>Edit view</button>
          <button class="btn btn-outline-info pull-right" onclick={ () => actions.setInstrumentView('live') }>Live view</button>
        </div>
      </div>
      <div class="col-10">
        { instrumentView(state, actions) }
      </div>
    </div>
  </div>
)
