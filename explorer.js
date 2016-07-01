SPACEX = SPACEX || {};

SPACEX.Explorer = function() {

  var homePlanet = SPACEX.systems[0].planets[0];

  SPACEX.GameObject.call(this, {
    x: homePlanet.x + homePlanet.r + 100,
    y: homePlanet.y + homePlanet.r + 100,
    width: 100,
    height: 100
  });

  this.v = 0;
  this.turningSpeed = 0.01;
  this.acceleration = 0.2;
  this.stopping = false;

  this.cargo = {
    hydrogen: 100,
    carbon: 100,
    oxygen: 100,
    iron: 100,
    titanium: 100,
    fuel: 1000
  };

  this.weaponSlots = [];
  this.maxWeapons = 4;

  this.name = "explorer";

  this.angle = 0;
  this.img = new Image();
  this.img.src = "assets/ships/unique_alien/medium.png"

  //Add HUD display object (fixedPosition)
};

SPACEX.Explorer.extends(SPACEX.GameObject);

SPACEX.Explorer.prototype.thrust = function(delta) {
  this.v += delta * this.acceleration;
};

SPACEX.Explorer.prototype.rotate = function(delta) {
  this.angle += delta * (this.turningSpeed * (100 / (100 + this.v)));
};

SPACEX.Explorer.prototype.stop = function() {
  this.stopping = true;
}

SPACEX.Explorer.prototype.update = function(delta) {
  if(this.stopping) {
    this.v -= this.acceleration;
    if(this.v <= 0) {
      this.stopping = false;
    }
  }
  this.x -= Math.sin(this.angle) * this.v;
  this.y -= Math.cos(this.angle) * this.v;
};

SPACEX.Explorer.prototype.drawImpl = function() {
  ctx.translate(this.x, this.y);

  //Ship image
  ctx.rotate(-this.angle);
  ctx.translate(-(this.width / 2), -(this.width / 2) * this.img.height / this.img.width);
  ctx.drawImage(this.img, 0, 0, this.width, this.width * this.img.height / this.img.width);
  ctx.translate((this.width / 2), (this.width / 2) * this.img.height / this.img.width);
  ctx.rotate(this.angle);
  ctx.translate(-(this.x - (this.width / 2)), -(this.y - (this.width / 2)));

  //Weapons firing
  // for(var i = 0; i < 4; i++) {
  //   ctx.translate(this.x - this.width / 2, this.y - this.height / 2);
  //   ctx.rotate(-this.angle);
  //
  //   ctx.beginPath();
  //   ctx.strokeStyle = "yellow";
  //   ctx.lineWidth = 1;
  //   ctx.moveTo(0, i);
  //
  //   ctx.rotate(this.angle);
  //   ctx.translate(-(this.x - this.width / 2), -(this.y - this.height / 2));
  //
  //   ctx.lineTo(50, 50);
  //
  //   ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
  //   ctx.stroke();
  //   ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);
  // }
};
