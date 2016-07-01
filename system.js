SPACEX = SPACEX || {};

var SPACEX = SPACEX || {};

SPACEX.System = function(arm) {
  var rotate_point = function(cx, cy, angle, x, y) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);

    // translate point back to origin:
    x -= cx;
    y -= cy;

    // rotate point
    var xnew = x * c - y * s;
    var ynew = x * s + y * c;

    // translate point back:
    x = xnew + cx;
    y = ynew + cy;

    return {
      x: x,
      y: y
    };
  };

  var x;
  var y;
  var angleAdjust;

  var armDistanceFactor = getBiasedRandomNumber(0, GALAXY_ARM_LENGTH, 0, 0.1);

  if(arm == "top") {
    x = getBiasedRandomNumber(-GALAXY_ARM_WIDTH*(1 - armDistanceFactor / GALAXY_ARM_LENGTH), GALAXY_ARM_WIDTH, 0, armDistanceFactor / GALAXY_ARM_LENGTH);
    y = -armDistanceFactor;
    angleAdjust = GALAXY_ARM_ROTATION * (y / GALAXY_ARM_LENGTH);
  }
  else if(arm == "bottom") {
    x = getBiasedRandomNumber(-GALAXY_ARM_WIDTH*(1 - armDistanceFactor / GALAXY_ARM_LENGTH), GALAXY_ARM_WIDTH, 0, armDistanceFactor / GALAXY_ARM_LENGTH);
    y = armDistanceFactor;
    angleAdjust = -GALAXY_ARM_ROTATION * (y / GALAXY_ARM_LENGTH);
  }
  else if(arm == "left") {
    x = -armDistanceFactor;
    y = getBiasedRandomNumber(-GALAXY_ARM_WIDTH*(1 - armDistanceFactor / GALAXY_ARM_LENGTH), GALAXY_ARM_WIDTH, 0, armDistanceFactor / GALAXY_ARM_LENGTH);
    angleAdjust = GALAXY_ARM_ROTATION * (x / GALAXY_ARM_LENGTH);
  }
  else if(arm == "right") {
    x = armDistanceFactor;
    y = getBiasedRandomNumber(-GALAXY_ARM_WIDTH*(1 - armDistanceFactor / GALAXY_ARM_LENGTH), GALAXY_ARM_WIDTH, 0, armDistanceFactor / GALAXY_ARM_LENGTH);
    angleAdjust = -GALAXY_ARM_ROTATION * (x / GALAXY_ARM_LENGTH);
  }

  var rotatedPosition = rotate_point(0, 0, angleAdjust, x, y);
  var sunX = rotatedPosition.x;
  var sunY = rotatedPosition.y;

  var sunRadius = Math.random() * SUN_RADIUS / 2 + SUN_RADIUS / 2;

  SPACEX.GameObject.call(this, {
    type: "system",
    x: sunX,
    y: sunY,
    width: SYSTEM_RADIUS * 2,
    height: SYSTEM_RADIUS * 2
  });

  this.r = SYSTEM_RADIUS;

  this.sun = new SPACEX.Sun(sunX, sunY, sunRadius);

  this.addChildObject(this.sun);

  this.planets = [];

  var numPlanets = randInRange(MIN_NUM_PLANETS, MAX_NUM_PLANETS);

  for(var i = 0; i < numPlanets; i++) {
    //TODO: Prevent plants too close to sun and overlapping orbits
    var planetX = sunX + Math.random() * SYSTEM_RADIUS - SYSTEM_RADIUS / 2;
    var planetY = sunY + Math.random() * SYSTEM_RADIUS - SYSTEM_RADIUS / 2;

    var planet = new SPACEX.Planet(planetX, planetY, sunX, sunY);
    this.planets.push(planet);
    this.addChildObject(planet);
  }

  this.name = makeid();

  this.hover = false;
  this.selected = false;
};

SPACEX.System.extends(SPACEX.GameObject);

SPACEX.System.prototype.draw = function(mat) {

  var zoomAdjust = Math.min(1/SPACEX.app.zoom, 5);

  if(SPACEX.app.zoom < SYSTEM_ZOOM_LIMIT) {
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.strokeStyle = (this.hover || this.selected) ? "blue" : "gray";
    ctx.lineWidth = 1;
    ctx.arc(0, 0, SYSTEM_RADIUS, 0, Math.PI * 2);

    ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
    ctx.stroke();
    ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);

    ctx.translate(-this.x, -this.y);

    if(SPACEX.app.zoom > 0.0001) {
      var zoomAdjust2 = Math.min(1/SPACEX.app.zoom, 5000);
      //Name
      ctx.translate(this.x, this.y);
      ctx.rotate(-SPACEX.explorer.angle);
      ctx.scale(zoomAdjust2, zoomAdjust2);
      ctx.fillStyle = "green";
      ctx.font = "20px Arial";
      ctx.fillText(this.name, 0, -(this.r + 20) * 1 / zoomAdjust2);
      ctx.scale(1 / zoomAdjust2, 1 / zoomAdjust2);
      ctx.rotate(SPACEX.explorer.angle);
      ctx.translate(-(this.x), -(this.y));
    }
  }

  if(SPACEX.app.zoom > MAP_ZOOM_LIMIT) {
    SPACEX.GameObject.prototype.draw.call(this, mat);
  }
};

SPACEX.System.prototype.drawImpl = function() {
};

SPACEX.System.prototype.mouseMoveImpl = function(x, y) {
  //SPACEX.GameObject.prototype.mouseMove.call(this, x, y);
};

SPACEX.System.prototype.mouseClickImpl = function(x, y) {
  SPACEX.selectedSystem = this;
  //SPACEX.GameObject.prototype.mouseClick.call(this, x, y);
};

SPACEX.System.prototype.getWorldBoundingRectangle = function() {
  return {
    p1: { x: this.sun.x - SYSTEM_RADIUS, y: this.sun.y - SYSTEM_RADIUS },
    p2: { x: this.sun.x + SYSTEM_RADIUS, y: this.sun.y - SYSTEM_RADIUS },
    p3: { x: this.sun.x + SYSTEM_RADIUS, y: this.sun.y + SYSTEM_RADIUS },
    p4: { x: this.sun.x - SYSTEM_RADIUS, y: this.sun.y + SYSTEM_RADIUS }
  };
};
