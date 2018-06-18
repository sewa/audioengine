import { app } from "hyperapp";

import { actions, state } from './actions';
import { view } from './components/instrument';
import { init as initClock } from './clock';
import { osc } from './tone';

initClock();
osc.start();
app(state, actions, view, document.body);

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
