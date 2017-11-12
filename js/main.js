window.onload = function(){
  var cv = document.getElementById("renderCanvas");
  window.addEventListener("resize", resize, false);
  store.tileDim = getTileDimensions(100);
  resize();
};
store = {};
var draw= function(){
  for(var x = 0; x < 10; x++){
    for( var y = 0; y < 10; y++ ){
      drawTile(x,y)
    }
  }
  for(var x = 0; x < 10; x++){
    for( var y = 0; y < 10; y++ ){
      drawTile(x,y,-1)
    }
  }
};
var resize = function(e){
  var cv = document.getElementById("renderCanvas"),
      bdr = cv.getBoundingClientRect();
  cv.width = bdr.width;
  cv.height = bdr.height;
  store.center = {x: cv.width / 2, y : cv.height / 2 };
  console.log("canvas width: " + cv.width + ", height: " + cv.height );
  draw()
};
var getTileCenter = function(x,y,z=0){
  var s = store,
      c = s.center,
      d = s.tileDim;

/*
      x1 = c.x + Math.cos( -30 * Math.PI / 180 ) * d.side * x,
      y1 = c.y + Math.sin( -30 * Math.PI / 180 ) * d.side * x,
      x2 = x1 + Math.cos( 30 * Math.PI / 180 ) * d.side * y,
      y2 = y1 + Math.sin( 30 * Math.PI / 180 ) * d.side * y + z * d.h * 2;
*/
  return {  x: c.x + x * d.w + y * d.w,
            y: c.y + x * d.h + y * -d.h + z * d.h * 2
          };
};
var getTileCenter2 = function(x,y,z=0){
  var s = store,
      c = s.center,
      d = s.tileDim,
      x1 = c.x + Math.cos( -30 * Math.PI / 180 ) * d.side * x,
      y1 = c.y + Math.sin( -30 * Math.PI / 180 ) * d.side * x,
      x2 = x1 + Math.cos( 30 * Math.PI / 180 ) * d.side * y,
      y2 = y1 + Math.sin( 30 * Math.PI / 180 ) * d.side * y + z * d.h * 2;
  return {x:x2, y: y2};
};
var drawTile = function(x,y,z=0){
  var d = store.tileDim,
      c = getTileCenter(x,y,z),
      cv = document.getElementById("renderCanvas"),
      ctx = cv.getContext("2d");
  ctx.beginPath();
  ctx.moveTo( c.x - d.w, c.y);
  ctx.lineTo( c.x, c.y + d.h );
  ctx.lineTo( c.x + d.w, c.y );
  ctx.lineTo( c.x, c.y - d.h );
  ctx.closePath();
  ctx.stroke();
}
var getTileDimensions = function( width ){
  var lx = 0,
      ly = 0,
      rx = width,
      ry = 0,
      radians = -30 * Math.PI / 180,
      lpx = Math.cos(radians) * 10,
      lpy = Math.sin(radians) * 10,
      rpx = rx + Math.cos( -150 * Math.PI / 180 ) * 10,
      rpy = ry + Math.sin( -150 * Math.PI / 180 ) * 10,
      intersection = line_intersect(lx, ly, lpx, lpy, rx, ry, rpx, rpy),
      tx = intersection.x,
      ty = intersection.y,
      bx = tx,
      by = -intersection.y,
      w = tx - lx,
      h = ty - ly;

    return {  w: w,
              h: h,
              side: Math.sqrt( w * w + h * h),
              toX:{x:w, y:h},
              toY:{x:w, y:-h}
            }
};
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4){
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua*(x2 - x1),
        y: y1 + ua*(y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
};
var svgContStrings = {
  svgOpen:function(width=100,height=100){
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'">'
  },
  foreignObjectOpen:function(){
    return '<foreignObject width="100%" height="100%">'
  },
  divOpen:function(style){
    return '<div xmlns="http://www.w3.org/1999/xhtml"'+ (style ? ' style="'+style+'"' : '') +'>'
  },
  closers:function(){
    return '</div></foreignObject></svg>'
  },
  DOMURL: window.URL || window.webkitURL || window,
  loadCallback: function(domurl,url){
    domurl.revokeObjectURL(url);
  },
  htmlToImg: function(ob,callback){
    var img = new Image();
    var c = svgContStrings;
    var data = '' + c.svgOpen(ob.width||100, ob.height||100) + c.foreignObjectOpen() + c.divOpen(ob.contDivStyle) + ob.data + c.closers();
    var svg = new Blob([data], {type: 'image/svg+xml'});
    var url = svgContStrings.DOMURL.createObjectURL(svg);
    var callbackHandler = {
      DOMURL: c.DOMURL,
      cbk2: c.loadCallback,
      cbk1: callback,
      img: img,
      url:url
    };
    img.addEventListener("load",function(img){
      var self = this;
      self.cbk1(self.img);
      self.cbk2(this.DOMURL, self.url);
    }.bind( callbackHandler ));
    img.src = url;
  }

};

var testDOMtoCANVAS = function(){
  svgContStrings.htmlToImg(
    {   width:200,
        height:200,
        contDivStyle:"font-size:1em",
        data: '<span>OKAY C\'EST BON</span>'
    },
    function(img){
      var cv = document.getElementById("renderCanvas"),
      ctx = cv.getContext("2d");
      ctx.drawImage(img, 0, 0);
    }
  );
};
