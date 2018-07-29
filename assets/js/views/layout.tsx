import { h } from "hyperapp"
import { view as instrumentView } from './instrument'
import { Actions } from '../actions'
import { State } from '../state'

export const view = (state:State, actions:Actions) => (
  <div class="" style={{ marginTop: '20px' }}>
    <div class="row instrument">
      <div class="col-20">
        { instrumentView(state, actions) }
      
        <div class="btn-group-vertical float-right">
          <button class="btn btn-outline-info pull-right" onclick={ () => actions.setInstrumentView('edit') }>Edit</button>
          <button class="btn btn-outline-info pull-right" onclick={ () => actions.setInstrumentView('live') }>Live</button>
        </div>
      </div>
    </div>
  </div>
)
