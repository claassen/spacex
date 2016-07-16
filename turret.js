SPACEX = SPACEX || {};

SPACEX.Turret = function(ship, options) {
  this.ship = ship;

  this.trackingSpeed = options.trackingSpeed;
  this.shotColor = options.shotColor;
  this.beamWidth = options.beamWidth;
  this.shotDuration = options.shotDuration;
  this.shotPeriod = options.shotPeriod;
  this.range = options.range;
  this.damage = options.damage;

  this.isActive = false;
  this.isFiring = false;
  this.isTracking = false;
  this.fired = false;
  this.shotTimer = 0;

  this.currentTarget = null;
  this.angle = 0;
};

SPACEX.Turret.prototype.setActive = function(active) {
  this.isActive = active;
};

SPACEX.Turret.prototype.update = function(i) {
  if(this.ship.currentSystem) {
    var closestTarget = null;
    var closestDistance = Infinity;

    for(var i = 0; i < SPACEX.app.childObjects.length; i++) {
      var obj = SPACEX.app.childObjects[i];

      if(obj.type == "player") {
          obj = obj.ship;
      }

      if(obj.type == "ship") {
        if(obj != this.ship && obj.currentSystem == this.ship.currentSystem && !obj.isExploding && !obj.isDestroyed && obj.faction != this.ship.faction) {

          var distance = Geometry.distance(this.ship.x, this.ship.y, obj.x, obj.y);

          if(distance <= this.range && distance < closestDistance) {
            closestDistance = distance;
            closestTarget = obj;
          }
        }
      }
    }

    this.currentTarget = closestTarget;

    if(this.currentTarget != null) {
      var yDiff = this.currentTarget.y - (this.ship.y /*- (i + 1) * 5*/);
      var xDiff = this.currentTarget.x - this.ship.x;

      var angleToHit = Math.atan2(yDiff, xDiff);

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

      if(Math.abs(this.angle - angleToHit) <= this.trackingSpeed * this.shotDuration) {
        this.isTracking = false;

        if(this.shotTimer < this.shotDuration) {
          this.fired = true;
          this.isFiring = true;
        }
        else {
          this.isFiring = false;
        }
      }
      else {
        this.isFiring = false;
        this.isTracking = true;
      }

      if(this.fired) {
        this.shotTimer++;
      }

      if(this.shotTimer > this.shotPeriod) {
        this.shotTimer = 0;
        this.fired = false;
      }

      if(this.isFiring) {
        if(Geometry.doesLineIntersectCircle(this.ship.x, this.ship.y /*- (i + 1) * 5*/, Math.cos(this.angle) * this.range, Math.sin(this.angle) * this.range, this.currentTarget.x, this.currentTarget.y, this.currentTarget.r)) {
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
    ctx.moveTo(0, -(i + 1) * 5);

    ctx.rotate(this.ship.angle);
    ctx.translate(-(this.ship.x), -(this.ship.y));

    if(Geometry.doesLineIntersectCircle(this.ship.x, this.ship.y - (i + 1) * 5, this.ship.x + Math.cos(this.angle) * this.range, this.ship.y + Math.sin(this.angle) * this.range, this.currentTarget.x, this.currentTarget.y, this.currentTarget.r)) {
      ctx.lineTo(this.currentTarget.x, this.currentTarget.y);
    }
    else {
      ctx.lineTo(this.ship.x + Math.cos(this.angle) * this.range, this.ship.y - (i + 1) * 5 + Math.sin(this.angle) * this.range);
    }

    ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
    ctx.stroke();
    ctx.closePath();
    ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);
  }
};
