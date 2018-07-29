import { h } from "hyperapp"
import { view as instrumentView } from './instrument'
import { Actions } from '../actions'
import { State } from '../state'

export const view = (state:State, actions:Actions) => (
  <div class="page dark">
    <div class="container full-width" style={{ marginTop: '20px' }}>

      <div class="row menu">
        <div class="col-16">
        </div>
        <div class="col-4">
          <div class="btn-group-horizontal">
            <button class="btn btn-outline-info pull-right" onclick={ () => actions.setInstrumentView('edit') }>Edit</button>
            <button class="btn btn-outline-info pull-right" onclick={ () => actions.setInstrumentView('live') }>Live</button>
          </div>
        </div>
      </div>
      
      <div class="row instrument">
        <div class="col-20">
          { instrumentView(state, actions) }    
        </div>
      </div>
    </div>
  </div>
)
