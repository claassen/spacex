SPACEX = SPACEX || {};

SPACEX.Hud = function() {
  SPACEX.GameObject.call(this, {
    type: "hud",
    x: 0,
    y: 0,
    width: 200,
    height: 100,
    isFixedPosition: true
  });
};

SPACEX.Hud.extends(SPACEX.GameObject);

SPACEX.Hud.prototype.drawImpl = function() {
  // ctx.beginPath();
  // ctx.strokeStyle = "white";
  // ctx.lineWidth = 2;
  // ctx.strokeRect(0, 0, SPACEX.app.width, 50);
  // ctx.closePath();

  ctx.drawImage(SPACEX.player.ship.img, 10, 5, 40 * SPACEX.player.ship.img.width / SPACEX.player.ship.img.height, 40);

  //Hull and shield
  ctx.strokeStyle = "blue";
  ctx.strokeRect(50, 10, 100, 10);
  ctx.fillStyle = "blue";
  ctx.fillRect(50, 10, SPACEX.player.ship.shield / SPACEX.player.ship.maxShield * 100, 10);
  ctx.fillStyle = "white";
  ctx.font = "8px Arial";
  ctx.fillText(Math.floor(SPACEX.player.ship.shield) + " / " + SPACEX.player.ship.maxShield, 52, 18);

  ctx.strokeStyle = "gray";
  ctx.strokeRect(50, 30, 100, 10);
  ctx.fillStyle = "gray";
  ctx.fillRect(50, 30, SPACEX.player.ship.hull / SPACEX.player.ship.maxHull * 100, 10);
  ctx.fillStyle = "white";
  ctx.font = "8px Arial";
  ctx.fillText(Math.floor(SPACEX.player.ship.hull) + " / " + SPACEX.player.ship.maxHull, 52, 38);

  //Fuel/energy?
  ctx.strokeStyle = "red";
  ctx.strokeRect(170, 10, 100, 10);
  ctx.fillStyle = "red";
  ctx.fillRect(170, 10, Math.floor(SPACEX.player.ship.fuel) / SPACEX.player.ship.maxFuel * 100, 10);
  ctx.fillStyle = "white";
  ctx.font = "8px Arial";
  ctx.fillText(Math.floor(SPACEX.player.ship.fuel) + " / " + SPACEX.player.ship.maxFuel, 172, 18);
};

SPACEX.Hud.prototype.mouseClickImpl = function() {
  console.log("hud move");
};
