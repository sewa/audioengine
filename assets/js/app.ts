import { app } from 'hyperapp'
import { Socket } from 'phoenix'

import { actions, ActionsType } from './actions'
import { createState, StateType } from './state'
import { view } from './views/instrument'

const socket = new Socket("/socket")
socket.connect()

const state = createState(socket)
const main = app<StateType, ActionsType>(state, actions, view, document.body)
main.initTone();
main.channels.connect("control")

// $(function(){
//   //mobile start
//   if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
//     $("body").addClass("Mobile");
//     var element = $("<div>", {"id" : "MobileStart"}).appendTo("body");
//     var btn = $("<div>").attr("class", "button").text("Start").appendTo(element);
//     $(btn).click(function() {
//       initClock();
//       osc.start();
//       $(this).hide();
//     });
//   } else {
//     initClock();
//     osc.start();
//   }
// });
