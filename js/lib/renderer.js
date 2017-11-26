class renderer{
  constructor(){
    this.viewport = document.createElement("div");
    this.viewport.classList.add("viewport");
    this.wrapper = this.viewport.appendChild( document.createElement("div") );
    this.wrapper.classList.add("wrapper");
    this.layers = new Map();
  }
}
