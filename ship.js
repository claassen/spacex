SPACEX = SPACEX || {};

SPACEX.Ship = function(size, image, options) {

  SPACEX.GameObject.call(this, {
    type: "ship",
    x: 0,
    y: 0,
    width: size,
    height: size
  });

  this.turningSpeed = 0.02;
  this.acceleration = 5.2;
  this.stopping = false;

  this.maxShield = 1000;
  this.shield = 0;
  this.shieldRegenRate = 1;

  this.maxHull = 1000;
  this.hull = 1000;

  this.maxFuel = 10000;
  this.fuel = 10000;
  this.fuelBurnRate = 1;

  this.v = 0;

  this.turrets = [];

  this.turrets.push(new SPACEX.Turret(this, {
    range: 1000,
    shotColor: "blue",
    beamWidth: 1,
    shotDuration: 20,
    shotPeriod: 40,
    trackingSpeed: 0.1,
    damage: 1
  }));

  this.turrets.push(new SPACEX.Turret(this, {
    range: 10000,
    shotColor: "red",
    beamWidth: 3,
    shotDuration: 20,
    shotPeriod: 100,
    trackingSpeed: 0.008,
    damage: 5
  }));

  this.angle = 0;
  this.img = image;
};

SPACEX.Ship.extends(SPACEX.GameObject);

SPACEX.Ship.prototype.thrust = function(delta) {
  if(this.fuel > 0) {
    this.v += delta * this.acceleration;
    this.fuel -= this.fuelBurnRate;
  }
};

SPACEX.Ship.prototype.rotate = function(delta) {
  if(this.fuel > 0) {
    this.angle += delta * (this.turningSpeed * (100 / (100 + this.v)));
    this.fuel -= this.fuelBurnRate * Math.min(1, this.v / 1000);
  }
};

SPACEX.Ship.prototype.stop = function() {
  this.stopping = true;
}

SPACEX.Ship.prototype.update = function() {
  //Update the current system the ship is in
  for(var i = 0; i < SPACEX.systems.length; i++) {
    if(Geometry.isCollision(SPACEX.systems[i], { x: this.x, y: this.y })) {
      this.currentSystem = SPACEX.systems[i];
    }
  }

  if(this.stopping) {
    this.v -= this.acceleration;
    this.fuel -= this.fuelBurnRate;
    if(this.v <= 0) {
      this.stopping = false;
    }
  }

  //Update turrets
  for(var i = 0; i < this.turrets.length; i++) {
    this.turrets[i].update();
  }

  //Shield regen
  if(this.shield < this.maxShield) {
    this.shield += Math.min(this.shieldRegenRate, this.maxShield - this.shield);
  }
};

SPACEX.Ship.prototype.takeDamage = function(damage) {
  var shieldDamage = Math.min(this.shield, damage);

  this.shield -= shieldDamage;

  this.hull -= damage - shieldDamage;
};

SPACEX.Ship.prototype.drawImpl = function() {
  //Ship image
  ctx.rotate(-this.angle);
  ctx.translate(this.x + -(this.width / 2) * this.img.width / this.img.height, this.y + -(this.height / 2));
  ctx.drawImage(this.img, 0, 0, this.width * this.img.width / this.img.height, this.height);
  ctx.translate(-this.x + (this.width / 2) * this.img.width / this.img.height, -this.y + (this.height / 2));
  ctx.rotate(this.angle);

  //ctx.translate(this.x + -(this.width / 2), this.y + -(this.width / 2));

  //Turrets
  for(var i = 0; i < this.turrets.length; i++) {
    this.turrets[i].draw(i);
  }

  //ctx.translate(-this.x + (this.width / 2), -this.y + (this.width / 2));
};
