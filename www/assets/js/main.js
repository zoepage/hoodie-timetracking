'use strict';

// init hoodie
window.hoodie   = new Hoodie();

// init timeTracker
window.timeTracker = window.timeTracker || {};



// init vars


var getTime = function getTime(eve){
    var time = Date.now();
    var diff;
    var start = sessionStorage.getItem('start');

    if (start){
      diff = Date.now() - start;

      diff = formatTime(diff);

      hoodie.store.add('time', { title: diff })
        .done(function(time) { loadDOM(); })
        .fail(function(error){ alert(error); });
    }

    sessionStorage.setItem('start', time);
}




/* HELPER FUNCTIONs
   @desc:   formating the milliseconds in seconds, minutes and hours
   @param:  tracked time in milliseconds
*/
var formatTime = function formatTime(ms_time){
  var time = ms_time;
  var s, m, h;

// when the tracked time is more then an hour (60 * 60 * 1000)
  if (time > 3600000) {
    h = parseInt(time / 3600000);
    time = time % 3600000;
  } else {
    h = 0;
  }

// when the tracked time is more then a minute (60 * 1000)
  if (time > 60000) {
    m = parseInt(time / 60000);
    time = time % 60000;
  } else {
    m = 0;
  }

// when the tracked time is more then a second (1000)
  if (time > 1000) {
    s = parseInt(time / 1000);
    time = time % 1000;
  } else {
    s = 0;
  }

  h = addZero(h);
  m = addZero(m);
  s = addZero(s);

  return String(h)+ ' : ' + String(m) + ' : ' + String(s);
}

var loadDOM = function loadDOM(){
      hoodie.store.findAll('time').done(function(allTodos) {
        $('#timeList').empty();
        for (var i = 0, len = allTodos.length; i<len; i++) {
          $('#timeList').append(
            '<li data-id="' + allTodos[i].id + '">' +
              allTodos[i].title +
            '</li>'
          );
        }
      });
}

var run = function(){
  var start = sessionStorage.getItem('start');
  var now = Date.now(); 
 

  document.getElementById('clock').innerHTML = formatTime(now-start);
  window.setTimeout(run, 1000);
}

var deleteDB = function(){
  hoodie.store.removeAll('time')
  .done(function(removedTodos) {})
  .fail(function(error) {});
}

var addZero = function(n){
  if (n < 10) {
    n = '0' + String(n);
  }
  return n;
}

// deleteDB();

// run the clock
run();

// show the already saved times when page loads
loadDOM();

$('#track').bind('click', getTime);