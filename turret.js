SPACEX = SPACEX || {};

SPACEX.Turret = function(ship, options) {
  this.ship = ship;

  this.trackingSpeed = options.trackingSpeed;
  this.shotColor = options.shotColor; //'#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  this.beamWidth = options.beamWidth;
  this.shotDuration = options.shotDuration;
  this.shotPeriod = options.shotPeriod;
  this.range = options.range;
  this.damage = options.damage;

  this.isActive = false;
  this.isFiring = false;

  this.currentTarget = null;
  this.angle = 0;

  this.shotTimer = randInRange(0, this.shotPeriod);
};

SPACEX.Turret.prototype.setActive = function(active) {
  this.isActive = active;
};

SPACEX.Turret.prototype.update = function() {
  if(this.ship.currentSystem) {
    var closestTarget = null;
    var closestDistance = Infinity;

    for(var i = 0; i < this.ship.currentSystem.childObjects.length; i++) {
      var obj = this.ship.currentSystem.childObjects[i];

      if(obj.type == "planet") {
        var station = obj.childObjects[0];

        if(station != undefined) {
          var distance = Geometry.distance(this.ship.x, this.ship.y, station.x, station.y);

          if(distance <= this.range && distance < closestDistance) {
            closestDistance = distance;
            closestTarget = station;
          }
        }
      }
    }

    this.currentTarget = closestTarget;

    if(this.currentTarget != null) {

      var yDiff = this.ship.y - this.currentTarget.y;
      var xDiff = this.ship.x - this.currentTarget.x;

      var angleToHit = Math.atan(yDiff / xDiff);

      if(this.currentTarget.x < this.ship.x) {
        angleToHit += Math.PI;
      }

      var angleDelta = this.angle - angleToHit;

      if(Math.abs(angleDelta) > Math.PI) {
        if(angleDelta > 0) {
          angleDelta = -angleDelta + Math.PI;
        }
        else {
          angleDelta = -angleDelta - Math.PI;
        }
      }

      var trackDelta = angleDelta < 0
        ? Math.max(-this.trackingSpeed, angleDelta)
        : Math.min(this.trackingSpeed, angleDelta);

      this.angle -= trackDelta;

      while(this.angle > Math.PI * 2) {
        this.angle -= Math.PI * 2;
      }

      while(this.angle < -Math.PI * 2) {
        this.angle += Math.PI * 2;
      }

      if(this.shotTimer < this.shotDuration) {
        this.isFiring = true;
      }
      else {
        this.isFiring = false;
      }

      if(this.shotTimer > this.shotPeriod) {
        this.shotTimer = 0;
      }

      this.shotTimer++;

      if(this.isFiring) {
        if(Geometry.doesLineIntersectCircle(this.ship.x, this.ship.y + -this.ship.height / 2 + i * 10, Math.cos(this.angle) * this.range, Math.sin(this.angle) * this.range, this.currentTarget.x, this.currentTarget.y, this.currentTarget.r)) {
          this.currentTarget.takeDamage(this.damage);
        }
      }
    }
  }
  else {
    this.isFiring = false;
  }
};

SPACEX.Turret.prototype.draw = function(i) {
  if(this.currentTarget && this.isFiring) {
    ctx.translate(this.ship.x, this.ship.y);
    ctx.rotate(-this.ship.angle);

    ctx.beginPath();
    ctx.strokeStyle = this.shotColor;
    ctx.lineWidth = this.beamWidth;
    ctx.moveTo(0, -this.ship.height / 2 + (i + 1) * 10);

    ctx.rotate(this.ship.angle);
    ctx.translate(-(this.ship.x), -(this.ship.y));

    if(Geometry.doesLineIntersectCircle(this.ship.x, this.ship.y - this.ship.height / 2 + i * 10, this.ship.x + Math.cos(this.angle) * this.range, this.ship.y + Math.sin(this.angle) * this.range, this.currentTarget.x, this.currentTarget.y, this.currentTarget.r)) {
      ctx.lineTo(this.currentTarget.x, this.currentTarget.y);
    }
    else {
      ctx.lineTo(this.ship.x + Math.cos(this.angle) * this.range, this.ship.y + Math.sin(this.angle) * this.range);
    }

    ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
    ctx.stroke();
    ctx.closePath();
    ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);
  }
};
