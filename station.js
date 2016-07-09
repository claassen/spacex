SPACEX = SPACEX || {};

SPACEX.Station = function(x, y, planetX, planetY, planetRadius) {

  var r = STATION_RADIUS;

  SPACEX.GameObject.call(this, {
    type: "station",
    x: x,
    y: y,
    width: r * 2,
    height: r * 2,
    r: r
  });

  this.planetX = planetX;
  this.planetY = planetY;
  this.name = makeid();
  this.orbitRadius = Math.sqrt(Math.pow(planetX - x, 2) + Math.pow(planetY - y, 2));
  this.img = SPACEX.Assets.getRandomStationImage(this.planetType);

  this.hover = false;
  this.selected = false;
};

SPACEX.Station.extends(SPACEX.GameObject);

SPACEX.Station.prototype.drawImpl = function() {

  var zoomAdjust = Math.min(1/SPACEX.app.zoom, 5);

  //Name
  ctx.translate(this.x, this.y);
  ctx.rotate(-SPACEX.player.ship.angle);
  ctx.scale(zoomAdjust, zoomAdjust);
  ctx.fillStyle = "yellow";
  ctx.font = "20px Arial";
  ctx.fillText(this.name, 0, -(this.r + 20) * 1 / zoomAdjust);
  ctx.scale(1 / zoomAdjust, 1 / zoomAdjust);
  ctx.rotate(SPACEX.player.ship.angle);
  ctx.translate(-(this.x), -(this.y));

  //Orbit
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.planetX, this.planetY, this.orbitRadius, 0, Math.PI * 2);
    ctx.scale(zoomAdjust, zoomAdjust);
    ctx.stroke();
    ctx.scale(1 / zoomAdjust, 1 / zoomAdjust);

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

SPACEX.Station.prototype.mouseClickImpl = function(x, y) {
  SPACEX.selectedBody = this;
};

SPACEX.Station.prototype.takeDamage = function(damage) {
  //console.log("station damage");
};
