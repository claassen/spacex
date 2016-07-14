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
  this.shieldRegenRate = 0.1;

  this.maxHull = 1000;
  this.hull = 1000;

  this.maxFuel = 10000;
  this.fuel = 10000;
  this.fuelBurnRate = 1;

  this.isExploding = false;
  this.explodingTimer = 0;
  this.isDestroyed = false;

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

  this.ax = 0;
  this.ay = 0;
  this.vx = 0;
  this.vy = 0;
  this.vr = 0;
};

SPACEX.Ship.extends(SPACEX.GameObject);

SPACEX.Ship.prototype.thrustOn = function(delta) {
  if(this.fuel > 0) {
    this.ax = Math.sin(this.angle) * delta;
    this.ay = Math.cos(this.angle) * delta;
  }
};

SPACEX.Ship.prototype.thrustOff = function() {
  this.ax = 0;
  this.ay = 0;
}

SPACEX.Ship.prototype.rotateOn = function(delta) {
  if(this.fuel > 0) {
    this.vr = delta * this.turningSpeed;;
  }
};

SPACEX.Ship.prototype.rotateOff = function() {
  this.vr = 0;
};

SPACEX.Ship.prototype.stop = function() {
  this.stopping = true;
}

SPACEX.Ship.prototype.update = function() {
  this.currentSystem = undefined;

  for(var i = 0; i < SPACEX.systems.length; i++) {
    if(Geometry.isCollision(SPACEX.systems[i], { x: this.x, y: this.y })) {
      this.currentSystem = SPACEX.systems[i];
    }
  }

  if(this.currentSystem) {
    var sun = this.currentSystem.sun;

    var d = Math.max(Geometry.distance(this.x, this.y, sun.x, sun.y), sun.r);
    var f = gravity(SHIP_MASS, SUN_MASS, d);

    var theta = Math.atan2(this.y - sun.y, this.x - sun.x);
    var fx = Math.cos(theta) * f;
    var fy = Math.sin(theta) * f;

    var dx1 = fx / SHIP_MASS;
    var dy1 = fy / SHIP_MASS;

    this.vx += dx1;
    this.vy += dy1;

    for(var j = 0; j < this.currentSystem.planets.length; j++) {
      var planet = this.currentSystem.planets[j];

      var d = Math.max(Geometry.distance(this.x, this.y, planet.x, planet.y), planet.r);
      var f = gravity(SHIP_MASS, PLANET_MASS, d);

      var theta = Math.atan2(this.y - planet.y, this.x - planet.x);
      var fx = Math.cos(theta) * f;
  		var fy = Math.sin(theta) * f;

      var dx1 = fx / SHIP_MASS;
  		var dy1 = fy / SHIP_MASS;

      this.vx += dx1;
  		this.vy += dy1;
    }
  }

  this.angle += this.vr;

  this.vx += this.ax;
  this.vy += this.ay;

  if(this == SPACEX.player.ship) {
    this.x += this.vx;
    this.y += this.vy;
  }
  else {
    this.x -= this.vx;
    this.y -= this.vy;
  }

  if(!this.isExploding && !this.isDestroyed) {
    //Update turrets
    for(var i = 0; i < this.turrets.length; i++) {
      this.turrets[i].update(i);
    }

    //Shield regen
    if(this.shield < this.maxShield) {
      this.shield += Math.min(this.shieldRegenRate, this.maxShield - this.shield);
    }
  }
  else {
    for(var i = 0; i < this.turrets.length; i++) {
      this.turrets[i].isFiring = false;
      this.turrets[i].isTracking = false;
    }
  }

  if(this.isExploding) {
    if(this.explodingTimer < 100) {
      this.explodingTimer++;
    }
    else {
      this.isExploding = false;
      this.isDestroyed = true;
    }
  }

  if(this.ax !=0 || this.ay !=0) {
    this.fuel -= this.fuelBurnRate;
  }
};

SPACEX.Ship.prototype.takeDamage = function(damage) {
  var shieldDamage = Math.min(this.shield, damage);

  this.shield -= shieldDamage;

  this.hull -= damage - shieldDamage;

  if(this.hull <= 0) {
    this.isExploding = true;
  }
};

SPACEX.Ship.prototype.drawImpl = function() {
  if(SPACEX.app.zoom > MIN_DRAW_SYSTEM_ZOOM) {
    if(this.isDestroyed) {
     ctx.globalAlpha = 0.5;
    }

    //Ship image
    ctx.rotate(-this.angle);
    ctx.translate(this.x + -(this.width / 2) * this.img.width / this.img.height, this.y + -(this.height / 2));
    ctx.drawImage(this.img, 0, 0, this.width * this.img.width / this.img.height, this.height);
    ctx.translate(-this.x + (this.width / 2) * this.img.width / this.img.height, -this.y + (this.height / 2));
    ctx.rotate(this.angle);

    ctx.globalAlpha = 1;

    if(!this.isExploding && !this.isDestroyed) {
      //Turrets
      for(var i = 0; i < this.turrets.length; i++) {
        this.turrets[i].draw(i);
      }
    }

    if(this.isExploding && this.explodingTimer % Math.floor(randInRange(1, 10)) == 0) {
      for(var i = 0; i < randInRange(1, 20); i++) {
        ctx.fillStyle = selectValueWithProbability(["red", "yellow", "gray"], [30, 40, 30]);
        ctx.arc(randInRange(this.x - this.width / 10, this.x + this.width / 10), randInRange(this.y - this.height / 10, this.y + this.height / 10), randInRange(1, 5), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if(this != SPACEX.player.ship) {
      if(this.hover || SPACEX.app.selectedObject ==  this || this.isInActivationRange) {
        ctx.strokeStyle = this.isDestroyed ? "orange" : "blue";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r + SHIP_ACTIVATION_ZONE_RADIUS_OFFSET, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
};

SPACEX.Ship.prototype.getWorldBoundingRectangle = function() {
  return {
    p1: { x: this.x - 10000, y: this.y - 10000 },
    p2: { x: this.x + 10000, y: this.y - 10000 },
    p3: { x: this.x + 10000, y: this.y + 10000 },
    p4: { x: this.x - 10000, y: this.y + 10000 }
  };
};

SPACEX.Ship.prototype.mouseClickImpl = function(x, y) {
  SPACEX.app.selectedObject = this;
};
