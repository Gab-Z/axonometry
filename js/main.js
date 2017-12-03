var Store = {};
window.onload = () => {
  Store.renderer = new renderer();
  Store.renderLoop = new renderLoop( Store );
  Store.eventHandler = new eventHandler();
//  Store.eventHandler.addListener( "f", "wheel", "callback" )
  Store.mouse = {
    wheel:0,
    x:0,
    y:0
  };
  document.body.appendChild( Store.renderer.viewport )
//  addWheelListener( window, mousewheel );
  document.body.appendChild(counter("wheelCounter", "Wheel"));
  document.body.appendChild(counter("mouseCounter", "Mouse"));
  document.body.appendChild(counter("tasksCounter", "Tasks"));
  //captureMouseEvents();
  //Store.eventHandler.addListener( document.body, "mousemove", handleMouseMove );
  Store.eventHandler.addDrag( handleMouseMove )
}
var counter = (id, title) => {
  var cont = document.createElement("div"),
      titleCont = cont.appendChild( document.createElement("span") ),
      counterCont = cont.appendChild( document.createElement("span") );
  titleCont.textContent = title;
  counterCont.id = id;
  cont.classList.add("info")
  return cont;
}
var handleMouseMove = e => {
  Store.mouse.x = e.pageX;
  Store.mouse.y = e.pageY;
  Store.renderLoop.touchFunc( drawInfos );
}
var drawInfos = () => {
  let m = Store.mouse;
  document.getElementById("wheelCounter").textContent = m.wheel;
  document.getElementById("mouseCounter").textContent = "x: " + m.x + "y: " + m.y;
  document.getElementById("tasksCounter").textContent = Store.renderLoop.funcs.size;
}
var mousewheel = e => {
  let restoreGME = false;
  if( Store.globalMouseEventsPrevented ){
    restoreGlobalMouseEvents ();
    restoreGME = true;
  }
  Store.mouse.wheel += e.deltaY > 0 ? 1 : -1;
  Store.renderLoop.touchFunc( drawInfos );
  if( restoreGME ) preventGlobalMouseEvents ();
  let str = "";
  for( let k in e ){
    str += k+" : "+e[k]+"\n";
  }
  alert(str)
  e.preventDefault();
}
