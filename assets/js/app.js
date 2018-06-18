// import './control_channel';
// import './sequence';
import { app } from "hyperapp";

import { actions, state } from './actions';
import { view } from './instruments/default';

app(state, actions, view, document.body);
