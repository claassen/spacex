SPACEX = SPACEX || {};

SPACEX.Asteroid = function(x, y, sun) {

  SPACEX.GameObject.call(this, {
    type: "asteroid",
    x: x,
    y: y,
    width: ASTEROID_RADIUS * 2,
    height: ASTEROID_RADIUS * 2,
    r: ASTEROID_RADIUS
  });

  this.sun = sun;
  this.img = SPACEX.Assets.getRandomAsteroidImage();

  this.hover = false;
  this.selected = false;

  this.name = "asteroid";
};

SPACEX.Asteroid.extends(SPACEX.GameObject);

SPACEX.Asteroid.prototype.drawImpl = function() {

  //Image
  ctx.translate(this.x - this.r, this.y - this.r);
  ctx.drawImage(this.img, 0, 0, this.r * 2, this.r * 2);
  ctx.translate(-(this.x - this.r), -(this.y - this.r));

  if(this.hover || this.selected) {
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

SPACEX.Asteroid.prototype.mouseClickImpl = function(x, y) {
  SPACEX.selectedBody = this;
};
