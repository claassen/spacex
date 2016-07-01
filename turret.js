SPACEX = SPACEX || {};

SPACEX.Turret = function() {
  this.trackingSpeed = 0.1;
  this.isActive = false;
  this.isFiring = false;
};

SPACEX.Turret.prototype.setActive = function(active) {
  this.isActive = active;
};

SPACEX.Turret.prototype.update = function() {

};
