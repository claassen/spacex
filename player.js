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
  //for(var i = 0; i < SPACEX.systems.length; i++) {
  //  SPACEX.systems[i].translate(-tx, -ty);
  //}

};

SPACEX.Player.extends(SPACEX.GameObject);

SPACEX.Player.prototype.drawImpl = function() {
};

SPACEX.Player.prototype.update = function() {
  this.ship.update();

  //for(var i = 0; i < SPACEX.systems.length; i++) {
  //  SPACEX.systems[i].translate(Math.sin(this.ship.angle) * this.ship.v, Math.cos(this.ship.angle) * this.ship.v);
  //}
  SPACEX.app.translate(Math.sin(this.ship.angle) * this.ship.v, Math.cos(this.ship.angle) * this.ship.v);
};
