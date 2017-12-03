/*
Implements window.requestAnimationFrame Polyfill
*/
window.requestAnimationFrame =      window.requestAnimationFrame
                                ||  window.mozRequestAnimationFrame
                                ||  window.webkitRequestAnimationFrame
                                ||  window.msRequestAnimationFrame;

class renderLoop {
  constructor(store){
    this.funcs = new Map();
    this.needUpdateTrigger = true;
    this.waitingUpdate = false;
    store.renderLoopBindedRender = this.render.bind( this );
  }
  addFuncOccurence( keyFunc = 0, value = 0 ){
    if( ! keyFunc instanceof Function ) return 0;
    let funcs = this.funcs,
        mergedValues = funcs.get( keyFunc ) || [];
    mergedValues.push( value );
    funcs.set( keyFunc, mergedValues )
    this.run();
  }
  overwriteFunc( keyFunc = 0, value = 0 ){
    if( ! keyFunc instanceof Function ) return 0;
    this.funcs.set( keyFunc, [ value ] );
    this.run();
  }
  touchFunc( keyFunc = 0, value = 0 ){
    if( ! keyFunc instanceof Function ) return 0;
    if( ! this.funcs.has( keyFunc ) ) this.funcs.set( keyFunc, [ value ] );
    this.run();
  }
  run(){
    if( this.needUpdateTrigger === true ){
      requestAnimationFrame( Store.renderLoopBindedRender );
    }else{
      this.waitingUpdate = true;
    }
  }
  render( timestamp ){
    this.needUpdateTrigger = false;
    var needUpdate = false;
    this.funcs.forEach( ( values, keyFunc, map ) => {
      let newValues = values.filter( v => {
          let result = keyFunc( v );
          return typeof result !== "undefined" && result !== false;
      });
      if( newValues.length > 0 ){
        map.set( keyFunc, newValues );
        needUpdate = true;
      }else{
        map.delete( keyFunc );
      }
    });
    if( needUpdate || this.waitingUpdate){
      this.waitingUpdate = false;
      requestAnimationFrame( Store.renderLoopBindedRender );
    }else{
      this.needUpdateTrigger = true;
    }
  }
}
