class eventHandler{
  constructor(){
    this.dragData = {
      funcs: [],
      dragging: false
    }
  }
  addDrag( callback ){
    if( ! callback instanceof Function ) return 0;
    let d = this.dragData,
        self = this;
    if( d.dragging === false ){
      d.dragging = true;
      if( document.setCapture )  document.setCapture();
      document.addEventListener ('mousemove', self.drag.bind( self ), false);
    }
    d.funcs.push( callback );
  }
  stopDrag(){
    if( document.releaseCapture ) document.releaseCapture();
    let d = this.dragData,
        self = this;
    d.dragging = false;
    d.funcs = [];
    document.removeEventListener ('mousemove', self.drag.bind( self ));
  }
  drag( e ){
    let funcs = this.dragData.funcs;
    funcs.forEach( ( func, i, arr ) => {
      func( e );
    } )
  }
  preventGlobalMouseEvents () {
    this.dragData.globalMouseEventsPrevented = true;
    document.body.style['pointer-events'] = 'none';
  }
  restoreGlobalMouseEvents () {
    this.dragData.globalMouseEventsPrevented = false;
    document.body.style['pointer-events'] = 'auto';
  }




  addListener( el, evType, callback ){
    let func = this[ "add_" + evType ];
    if( ! func ) return false;
    let handlers = this.handlers,
        evName = "_evt_" + evType;
    /*
    if( ! handlers.has( evType ) ){
      handlers.set( evName, new Event( evName ) );
      func();
    }
    */
    func();
    el.addEventListener( evName, callback, true );
  }
  add_wheel(){
    addWheelListener( window, Store.eventHandler.handleEvent );
  }
  add_mousedown(){
    document.addEventListener ('mousedown', Store.eventHandler.handleEvent, false);
  }
  add_mouseup(){
    document.addEventListener ('mouseup', Store.eventHandler.handleEvent, false);
  }
  add_mousemove(){
    document.addEventListener ('mousemove', Store.eventHandler.handleEvent, false);
  }
  add_click(){

  }
  add_keydown(){

  }
  add_keyup(){

  }
  add_keypress(){

  }
  handleEvent( e ){
    let evName = "_evt_" + e.type,
        targetTree = [],
        target = e.target,
        currentTarget = e.currentTarget,
        evType = e.type;
    for( let i = 0; 0 === 0; i++ ){
      targetTree.push( target );
      if( target === currentTarget ) break;
      target = target.parentNode;
    }
    let eventObject = new CustomEvent(
      evName,
      {  detail:{
          oldEvent : e,
          tree: targetTree
        }
      }
    );
    e.target.dispatchEvent( eventObject );
    //targetTree.forEach( ( el, i, tree ) => el.dispatchEvent( eventObject ) );
  }

}


// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window,document) {

    var prefix = "", _addEventListener, support;

    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
              "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );

        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };

    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaY: 0,
                deltaZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.deltaY || originalEvent.detail;
            }

            // it's time to fire the callback
            return callback( event );

        }, useCapture || false );
    }

})(window,document);


const EventListenerMode = {capture: true};

function preventGlobalMouseEvents () {
  Store.globalMouseEventsPrevented = true;
  document.body.style['pointer-events'] = 'none';
}

function restoreGlobalMouseEvents () {
  Store.globalMouseEventsPrevented = false;
  document.body.style['pointer-events'] = 'auto';
}

function mousemoveListener (e) {
  e.stopPropagation ();
  handleMouseMove(e)
}

function mouseupListener (e) {

  restoreGlobalMouseEvents ();
  document.removeEventListener ('mouseup',   mouseupListener,   EventListenerMode);
  document.removeEventListener ('mousemove', mousemoveListener, EventListenerMode);
  e.stopPropagation ();
}

function captureMouseEvents (e) {

  preventGlobalMouseEvents ();
  //document.addEventListener ('mouseup',   mouseupListener,   EventListenerMode);
  if( document.setCapture ) { document.setCapture(); }
  document.addEventListener ('mousemove', mousemoveListener, EventListenerMode);
  if(e){
    e.preventDefault ();
    e.stopPropagation ();
  }
}
function makeDraggable(element) {

  /* Simple drag implementation */
  element.onmousedown = function(event) {
    if(element.setCapture) { element.setCapture(); }

    document.onmousemove = function(event) {
      event = event;
      element.style.left = event.clientX + 'px';
      element.style.top = event.clientY + 'px';

      console.log('x: ', event.clientX);
      console.log('y: ', event.clientY);
    };

    document.onmouseup = function() {
          if(element.releaseCapture) { element.releaseCapture(); }
      console.log('mouseup')
      document.onmousemove = null;
      if(element.releaseCapture) { element.releaseCapture()}
    };

    if(element.setCapture) { element.setCapture(); console.log('set capture')}
  };

  /* These 3 lines are helpful for the browser to not accidentally
   * think the user is trying to "text select" the draggable object.
   * Unfortunately they also break draggability outside the window.
   */
element.unselectable = "on";
  element.onselectstart = function(){return false};
  element.style.userSelect = element.style.MozUserSelect = "none";
}
