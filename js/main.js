var Store = {};
window.onload = () => {
  Store.renderer = new renderer();
  document.body.appendChild( Store.renderer.viewport )
  addWheelListener( document.body, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
}
