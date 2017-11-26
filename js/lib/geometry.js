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
