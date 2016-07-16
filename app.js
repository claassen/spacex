
var SPACEX = SPACEX || {};

SPACEX.app = {};

SPACEX.App = function($canvas, screenWidth, screenHeight) {
	SPACEX.GameObject.call(this, {
		x: 0,
		y: 0,
		width: screenWidth,
		height: screenHeight,
		rotation: 0,
		zoom: 1,
		isClipped: true,
		isFixedPosition: true
	});

	this.name = "app";

	ctx = $canvas.getContext("2d");
	ctx.canvas.width = screenWidth;
	ctx.canvas.height = screenHeight;

	this.img = new Image();
	this.img.src = "assets/starfield.png";

	var getMouseCoords = function (e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	};

	var self = this;

	var zoom = function(delta) {
		if(self.zoom * delta < MIN_ZOOM_LIMIT || self.zoom * delta > MAX_ZOOM_LIMIT) {
			return;
		}

		self.zoom *= delta;
	};

	ctx.canvas.onmousedown = function (e) {
		var coords = getMouseCoords(e);
		self.mouseDown(coords.x, coords.y);
	};

	ctx.canvas.onmouseup = function (e) {
		var coords = getMouseCoords(e);
		self.mouseUp(coords.x, coords.y);
	};

	ctx.canvas.onclick = function (e) {
		var coords = getMouseCoords(e);
		self.mouseClick(coords.x, coords.y);
	};

	ctx.canvas.onmousemove = function (e) {
		var coords = getMouseCoords(e);
		self.mouseMove(coords.x, coords.y);
	};

	ctx.canvas.onmousewheel = function(e) {
		self.mouseScroll(e);
		if (e.wheelDelta > 0 || e.detail < 0) {
			// scroll up
			zoom(0.95);
		}
		else {
			// scroll down
			zoom(1.15);
		}
	};

	ctx.canvas.onkeydown = function(e) {
		self.keyDown(e);

		var charCode = e.which;

		//D
		if(charCode == 68) {
			SPACEX.player.ship.rotateOn(-1);
		}
		//A
		else if(charCode == 65) {
			SPACEX.player.ship.rotateOn(1);
		}
		//W
		else if(charCode == 87) {
			SPACEX.player.ship.thrustOn(1, e.shiftKey);
		}
		//S
		else if(charCode == 83) {
			SPACEX.player.ship.thrustOn(-1, e.shiftKey);
		}
		//Space
		else if(charCode == 32) {

		}
	};

	ctx.canvas.onkeyup = function(e) {
		self.keyUp(e);

		var charCode = e.which;

		//D
		if(charCode == 68) {
			SPACEX.player.ship.rotateOff();
		}
		//A
		else if(charCode == 65) {
			SPACEX.player.ship.rotateOff();
		}
		//W
		else if(charCode == 87) {
			SPACEX.player.ship.thrustOff();
		}
		//S
		else if(charCode == 83) {
			SPACEX.player.ship.thrustOff();
		}
		//Space
		else if(charCode == 32) {
			SPACEX.player.ship.stop();
		}
	};

	ctx.canvas.onkeypress = function(e) {
		self.keyPressed(e);
	};

	SPACEX.app = this;
};

SPACEX.App.extends(SPACEX.GameObject);

SPACEX.systems = [];
SPACEX.map = {};

SPACEX.App.prototype.init = function() {
	var systems = [];

	for(var i = 0; i < NUM_SYSTEMS / 4; i++) {
		systems.push(new SPACEX.System("top"));
		systems.push(new SPACEX.System("bottom"));
		systems.push(new SPACEX.System("left"));
		systems.push(new SPACEX.System("right"));
	}

	var discardedCount = 0;

	for(var i = 0; i < systems.length; i++) {
		var keepSystem = true;
		for(var j = i + 1; j < systems.length; j++) {
			if(Geometry.isInActivationZone(systems[i], {x: systems[j].x, y: systems[j].y}, SYSTEM_RADIUS)) {
				keepSystem = false;
				discardedCount++;
				break;
			}
		}
		if(keepSystem) {
			SPACEX.systems.push(systems[i]);
			this.addChildObject(systems[i]);
		}
	}

	console.log("Discarded " + discardedCount + " systems due to overlap.");

	SPACEX.player = new SPACEX.Player();

	this.addChildObject(SPACEX.player);

	SPACEX.hud = new SPACEX.Hud();

	this.addChildObject(SPACEX.hud);

	// for(var i = 0; i < 50; i++) {
	// 	var type = selectValueWithProbability(
	//     ["advanced", "advanced2", "explorer", "hostile", "industrial", "industrial2", "industrial3", "junky", "purple_alien", "unique_alien"],
	//     [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
	//   );
	//
	// 	var x = randInRange(-5000, 5000);
	// 	var y = randInRange(-5000, 5000);
	//
	// 	var ship = SPACEX.ShipHelper.getRandomShip(type, type);
	// 	ship.x = x;
	// 	ship.y = y;
	//
	// 	this.addChildObject(ship);
	// }
};

SPACEX.App.prototype.start = function() {
	var self = this;

	var intro = true;
	self.zoom = INTRO_ZOOM_END;

	var mainLoop = function() {
		// if(intro) {
		// 	self.zoom *= 1.04;
		// 	if(self.zoom >= INTRO_ZOOM_END) {
		// 		intro = false;
		// 	}
		// }

		self.update();
		self.draw();
		requestAnimationFrame(mainLoop);
	};

	ctx.drawImage(this.img, 0, 0);
	ctx.fillStyle = "blue";
	ctx.font = "36px Arial";
	ctx.fillText("SPACEX", this.width / 2 - 100, this.height / 2);

	setTimeout(mainLoop, 1000);
};

SPACEX.App.prototype.update = function() {
	this.rotation = SPACEX.player.ship.angle;
	this.offsetX = 0 + this.width / 2 / this.zoom;
	this.offsetY = 0 + this.height / 2 / this.zoom;

	SPACEX.GameObject.prototype.update.call(this);
};

SPACEX.App.prototype.drawImpl = function() {
	ctx.drawImage(this.img, 0, 0);
};
