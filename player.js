SPACEX = SPACEX || {};

SPACEX.Player = function() {

  // var type = selectValueWithProbability(
  //   ["advanced", "advanced2", "explorer", "hostile", "industrial", "industrial2", "industrial3", "junky", "purple_alien", "unique_alien"],
  //   [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  // );

  this.ship = SPACEX.ShipHelper.getRandomShip("explorer");

  SPACEX.GameObject.call(this, {
    type: "player",
    x: 0,
    y: 0,
    width: this.ship.width,
    height: this.ship.height,
    faction: "friendly"
  });

  this.addChildObject(this.ship);

  var homePlanet = SPACEX.systems[0].planets[0];

  var r = randInRange(homePlanet.r + 200, homePlanet.r + 500);

  var position = Geometry.getPositionAtAngle(homePlanet.x, homePlanet.y, r, randInRange(0, Math.PI * 2));

  SPACEX.app.translate(-position.x, -position.y);

  position.x = 0;
  position.y = 0;

  this.ship.currentOrbitTarget = homePlanet;
};

SPACEX.Player.extends(SPACEX.GameObject);

var predictedPathPositionsCache = [];
var previousPredictedPathZoom = null;
var predictedCacheRefeshTimer = 0;

SPACEX.Player.prototype.getAccelerationDueToGravity = function() {

};

SPACEX.Player.prototype.drawImpl = function() {
  //Projected path

  //Save current ship values
  var x = this.ship.x;
  var y = this.ship.x;
  var vx = this.ship.vx;
  var vy = this.ship.vy;
  var ax = this.ship.ax;
  var ay = this.ship.ay;

  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  ctx.setLineDash([Math.max(1, 10 * SPACEX.app.zoom), Math.max(2, 20 * SPACEX.app.zoom)]);
  ctx.moveTo(this.ship.x, this.ship.y);

  var system = this.ship.currentSystem;

  predictedCacheRefeshTimer++;

  if(predictedCacheRefeshTimer > 100 || predictedPathPositionsCache.length == 0 || previousPredictedPathZoom != SPACEX.app.zoom || this.ship.ax !=0 || this.ship.ay != 0) {
    predictedPathPositionsCache = [];

    for(var i = 0; i < Math.min(50000 / (SPACEX.app.zoom * 50), 20000); i++) {

      //Periodically check if the path went into another system
      if(i % 100 == 0) {
        for(var s = 0; s < SPACEX.systems.length; s++) {
          if(Geometry.isCollision(SPACEX.systems[s], { x: x, y: y })) {
            system = SPACEX.systems[s];
          }
        }
      }

      this.ship.ax = 0;
      this.ship.ay = 0;

      //'Velocity verlet'
      var acceleration = this.ship.getCurrentAcceleration();

      this.ship.x -= this.ship.vx + acceleration.x / 2;
      this.ship.y -= this.ship.vy + acceleration.y / 2;

      var newAcceleration = this.ship.getCurrentAcceleration();

      this.ship.vx += (acceleration.x + newAcceleration.x) / 2;
      this.ship.vy += (acceleration.y + newAcceleration.y) / 2;

      predictedPathPositionsCache.push({x: this.ship.x, y: this.ship.y});
    }
  }

  //Restore saved values
  this.ship.x = x;
  this.ship.y = y;
  this.ship.vx = vx;
  this.ship.vy = vy;
  this.ship.ax = ax;
  this.ship.ay = ay;

  if(predictedCacheRefeshTimer > 100) {
    predictedCacheRefeshTimer = 0;
  }

  for(var i = 0; i < predictedPathPositionsCache.length; i++) {
    var position = predictedPathPositionsCache[i];
    ctx.lineTo(position.x, position.y);
  }

  ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
  ctx.stroke();
  ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);

  ctx.setLineDash([]);
};

SPACEX.Player.prototype.update = function() {
  this.ship.update();

  this.currentPlanet = undefined;
  this.currentStation = undefined;

  for(var i = 0; i < SPACEX.app.childObjects.length; i++) {
      var obj = SPACEX.app.childObjects[i];

      obj.isInActivationRange = false;

      if(obj.type == "ship" && obj != this.ship) {
        if(Geometry.isInActivationZone(obj, { x: this.ship.x, y: this.ship.y }, SHIP_ACTIVATION_ZONE_RADIUS_OFFSET)) {
          obj.isInActivationRange = true;
        }
      }
      else if(obj.type == "system") {
        if(Geometry.isCollision(obj, { x: this.ship.x, y: this.ship.y })) {
          this.currentSystem = obj;
          obj.isInActivationRange = true;

          for(var j = 0; j < obj.planets.length; j++) {
            obj.planets[j].isInActivationRange = false;

            if(Geometry.isInActivationZone(obj.planets[j], { x: this.ship.x, y: this.ship.y }, PLANET_ACTIVATION_ZONE_RADIUS_OFFSET)) {
              this.currentPlanet = obj.planets[j];
              obj.planets[j].isInActivationRange = true;
            }

            if(obj.planets[j].station) {
              obj.planets[j].station.isInActivationRange = false;

              if(Geometry.isInActivationZone(obj.planets[j].station, { x: this.ship.x, y: this.ship.y }, STATION_ACTIVATION_ZONE_RADIUS_OFFSET)) {
                this.currentStation = obj.planets[j].station;
                obj.planets[j].station.isInActivationRange = true;
              }
            }
          }

          for(var j = 0; j < obj.asteroids.length; j++) {
            obj.asteroids[j].isInActivationRange = false;

            if(Geometry.isInActivationZone(obj.asteroids[j], { x: this.ship.x, y: this.ship.y }, ASTEROID_ACTIVATION_ZONE_RADIUS_OFFSET)) {
              this.currentAsteroid = obj.asteroids[j];
              obj.asteroids[j].isInActivationRange = true;
            }
          }
        }
      }
  }

  SPACEX.app.translate(this.ship.x, this.ship.y);
  this.ship.x = 0;
  this.ship.y = 0;
};
