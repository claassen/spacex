SPACEX = SPACEX || {};

SPACEX.Planet = function(x, y, sunX, sunY) {
  this.planetType = selectValueWithProbability(
    ["habitable", "uninhabitable", "gas"],
    [10, 60, 30]
  );

  this.r = Math.random() * PLANET_RADIUS / 2 + PLANET_RADIUS / 2;

  if(this.planetType == "gas") {
    this.r *= 3;
  }

  SPACEX.GameObject.call(this, {
    type: "planet",
    x: x,
    y: y,
    width: this.r * 2,
    height: this.r * 2
  });

  this.sunX = sunX;
  this.sunY = sunY;
  this.discovered = false;
  this.name = makeid();
  this.orbitRadius = Math.sqrt(Math.pow(sunX - x, 2) + Math.pow(sunY - y, 2));
  this.img = SPACEX.Assets.getRandomPlanetImage(this.planetType);

  this.hover = false;
  this.selected = false;
};

SPACEX.Planet.extends(SPACEX.GameObject);

SPACEX.Planet.prototype.drawImpl = function() {

  var zoomAdjust = Math.min(1/SPACEX.app.zoom, 5);

  //Name
  ctx.translate(this.x, this.y);
  ctx.rotate(-SPACEX.explorer.angle);
  ctx.scale(zoomAdjust, zoomAdjust);
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText(this.planetType, 0, -(this.r + 20) * 1 / zoomAdjust);
  ctx.scale(1 / zoomAdjust, 1 / zoomAdjust);
  ctx.rotate(SPACEX.explorer.angle);
  ctx.translate(-(this.x), -(this.y));

  //Orbit
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(this.sunX, this.sunY, this.orbitRadius, 0, Math.PI * 2);
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
    ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);
  }
};

SPACEX.Planet.prototype.mouseClickImpl = function(x, y) {
  SPACEX.selectedBody = this;
};
