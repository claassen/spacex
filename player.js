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
    height: this.ship.height
  });

  this.addChildObject(this.ship);

  var homePlanet = SPACEX.systems[0].planets[0];

  var tx = homePlanet.x - homePlanet.r - 100;
  var ty = homePlanet.y - homePlanet.r - 100;

  SPACEX.app.translate(-tx, -ty);
};

SPACEX.Player.extends(SPACEX.GameObject);

SPACEX.Player.prototype.drawImpl = function() {
  //Projected path
  var baseX = 0;
  var baseY = 0;

  var x = this.ship.x;
  var y = this.ship.x;
  var vx = this.ship.vx;
  var vy = this.ship.vy;

  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  ctx.setLineDash([Math.max(1, 10 * SPACEX.app.zoom), Math.max(2, 20 * SPACEX.app.zoom)]);
  ctx.moveTo(this.ship.x, this.ship.y);

  var sun = this.ship.currentSystem.sun;

  for(var i = 0; i < 10000; i++) {
    var d = Math.max(Geometry.distance(x, y, sun.x, sun.y), sun.r);
    var f = gravity(SHIP_MASS, SUN_MASS, d);

    var theta = Math.atan2(y - sun.y, x - sun.x);
    var fx = Math.cos(theta) * f;
    var fy = Math.sin(theta) * f;

    var dx1 = fx / SHIP_MASS;
    var dy1 = fy / SHIP_MASS;

    vx += dx1;
    vy += dy1;

    for(var j = 0; j < this.ship.currentSystem.planets.length; j++) {
      var planet = this.ship.currentSystem.planets[j];

      var d = Math.max(Geometry.distance(x, y, planet.x, planet.y), planet.r);
      var f = gravity(SHIP_MASS, PLANET_MASS, d);

      var theta = Math.atan2(y - planet.y, x - planet.x);
      var fx = Math.cos(theta) * f;
  		var fy = Math.sin(theta) * f;

      var dx1 = fx / SHIP_MASS;
  		var dy1 = fy / SHIP_MASS;

      vx += dx1;
  		vy += dy1;
    }

    x -= vx;
    y -= vy;

    ctx.lineTo(x, y);
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
