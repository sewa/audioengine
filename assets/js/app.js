import { app } from "hyperapp";

import { actions } from './actions';
import { state } from './state';
import { view } from './views/instrument';
import { osc } from './tone';

osc.start();
const main = app(state, actions, view, document.body);
main.initTone();
main.connect("control");

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
