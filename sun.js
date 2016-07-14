SPACEX.Sun = function(x, y, r) {
  SPACEX.GameObject.call(this, {
    type: "sun",
    x: x,
    y: y,
    width: r * 2,
    height: r * 2,
    r: r
  });

  this.discovered = false;
  this.name = makeid();
  this.img = SPACEX.Assets.getRandomSunImage();

  this.hover = false;
  // this.selected = false;
};

SPACEX.Sun.extends(SPACEX.GameObject);

SPACEX.Sun.prototype.drawImpl = function() {
  var zoomAdjust = Math.min(1/SPACEX.app.zoom, 5);

  ctx.translate(this.x - this.r, this.y - this.r);
  ctx.drawImage(this.img, 0, 0, this.r * 2, this.r * 2);
  ctx.translate(-(this.x - this.r), -(this.y - this.r));

  if(this.hover || SPACEX.app.selectedObject == this) {
    //Ring
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r + 20, 0, Math.PI * 2);
    ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
    ctx.stroke();
    ctx.closePath();
    ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);
  }
};

SPACEX.Sun.prototype.mouseClickImpl = function(x, y) {
  SPACEX.app.selectedObject = this;
};
