SPACEX = SPACEX || {};

var test = false;

SPACEX.Planet = function(x, y, sun) {
  this.planetType = selectValueWithProbability(
    ["habitable", "uninhabitable", "gas"],
    [PERCENT_HABITABLE_PLANETS, PERCENT_UNINHABITABLE_PLANETS, PERCENT_GAS_PLANETS]
  );

  var r = PLANET_RADIUS;

  if(this.planetType == "gas") {
    r = GAS_GIANT_RADIUS;
  }

  SPACEX.GameObject.call(this, {
    type: "planet",
    x: x,
    y: y,
    width: r * 2,
    height: r * 2,
    r: r
  });

  if(this.planetType == "habitable") {
    //Chance to have space station
    var hasStation = selectValueWithProbability(
      [true, false],
      [PERCENT_STATIONS, 100 - PERCENT_STATIONS]
    );

    if(hasStation) {
      var position = Geometry.getPositionAtAngle(x, y, r + STATION_ORBIT_DISTANCE, randInRange(0, Math.PI * 2));

      this.station = new SPACEX.Station(position.x, position.y, this);

      this.addChildObject(this.station);
    }

    var hasShips = false;

    test = true;
    // var hasShips = selectValueWithProbability(
    //   [true, false],
    //   [100, 0]
    // );


    if(hasShips) {
      var type = selectValueWithProbability(
  	    ["advanced", "advanced2", "explorer", "hostile", "industrial", "industrial2", "industrial3", "junky", "purple_alien", "unique_alien"],
  	    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  	  );

      var faction = selectValueWithProbability(
        [type, "friendly"],
        [50, 50]
      );

      for(var i = 0; i < randInRange(1, 10); i++) {
        var r = randInRange(this.r + 20,  this.r + 100);
        var position = Geometry.getPositionAtAngle(this.x, this.y, r, randInRange(0, Math.PI * 2));

    		var ship = SPACEX.ShipHelper.getRandomShip(type, type);
    		ship.x = position.x;
    		ship.y = position.y;

        var v = Math.sqrt((G * PLANET_MASS) / r);

        var theta = Math.atan2(this.y - ship.y, this.x - ship.x);

        ship.vx = v * Math.cos(theta);
    		ship.vy = v * Math.sin(theta);

        SPACEX.app.addChildObject(ship);
      }
    }
  }

  this.sun = sun;
  this.discovered = false;
  this.name = makeid();
  this.orbitRadius = Math.sqrt(Math.pow(sun.x - x, 2) + Math.pow(sun.y - y, 2));
  this.img = SPACEX.Assets.getRandomPlanetImage(this.planetType);

  this.hover = false;
};

SPACEX.Planet.extends(SPACEX.GameObject);

SPACEX.Planet.prototype.update = function() {

};

SPACEX.Planet.prototype.drawImpl = function() {
  if(SPACEX.app.zoom > MIN_DRAW_SYSTEM_ZOOM) {
    var zoomAdjust = Math.min(1/SPACEX.app.zoom, 5);

    //Name
    ctx.translate(this.x, this.y);
    ctx.rotate(-SPACEX.player.ship.angle);
    ctx.scale(zoomAdjust, zoomAdjust);
    ctx.fillStyle = "green";
    ctx.font = "20px Arial";
    ctx.fillText(this.planetType, 0, -(this.r + 20) * 1 / zoomAdjust);
    ctx.scale(1 / zoomAdjust, 1 / zoomAdjust);
    ctx.rotate(SPACEX.player.ship.angle);
    ctx.translate(-(this.x), -(this.y));

    //Orbit
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.sun.x, this.sun.y, this.orbitRadius, 0, Math.PI * 2);
    ctx.scale(zoomAdjust, zoomAdjust);
    ctx.stroke();
    ctx.closePath();
    ctx.scale(1 / zoomAdjust, 1 / zoomAdjust);

    //Image
    ctx.translate(this.x - this.r, this.y - this.r);
    ctx.drawImage(this.img, 0, 0, this.r * 2, this.r * 2);
    ctx.translate(-(this.x - this.r), -(this.y - this.r));

    if(this.hover || SPACEX.app.selectedObject == this || this.isInActivationRange) {
      //Ring
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r + PLANET_ACTIVATION_ZONE_RADIUS_OFFSET, 0, Math.PI * 2);
      ctx.scale(1/SPACEX.app.zoom, 1/SPACEX.app.zoom);
      ctx.stroke();
      ctx.closePath();
      ctx.scale(SPACEX.app.zoom, SPACEX.app.zoom);
    }
  }
};

SPACEX.Planet.prototype.mouseClickImpl = function(x, y) {
  SPACEX.app.selectedObject = this;
};
