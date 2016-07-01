
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

	var rotate = function(rads) {
		self.rotation += rads;
		SPACEX.map.rotation += rads;
	};

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

	ctx.canvas.onkeypress = function(e) {
		self.keyPressed(e);

		var charCode = e.which;

		//D
		if(charCode == 100) {
			//rotate(-0.05);
			SPACEX.explorer.rotate(-1);
		}
		//A
		else if(charCode == 97) {
			//rotate(0.05);
			SPACEX.explorer.rotate(1);
		}
		//W
		else if(charCode == 119) {
			SPACEX.explorer.thrust(1);
		}
		//S
		else if(charCode == 115) {
			SPACEX.explorer.thrust(-1);
		}
		//Space
		else if(charCode == 32) {
			SPACEX.explorer.stop();
		}
	};
};

SPACEX.App.extends(SPACEX.GameObject);

SPACEX.systems = [];
SPACEX.map = {};

SPACEX.App.prototype.init = function() {
	for(var i = 0; i < NUM_SYSTEMS / 4; i++) {
		SPACEX.systems.push(new SPACEX.System("top"));
		SPACEX.systems.push(new SPACEX.System("bottom"));
		SPACEX.systems.push(new SPACEX.System("left"));
		SPACEX.systems.push(new SPACEX.System("right"));
	}

	for(var i = 0; i < SPACEX.systems.length; i++) {
			this.addChildObject(SPACEX.systems[i]);
	}

	SPACEX.map = new SPACEX.Map(0, 0, 0.0125, this.width / 3, this.height / 3, this.width, this.height);

	for(var i = 0; i < SPACEX.systems.length; i++) {
			SPACEX.map.addChildObject(SPACEX.systems[i]);
	}

	//this.addChildObject(SPACEX.map);

	SPACEX.explorer = new SPACEX.Explorer();

	this.addChildObject(SPACEX.explorer);
};

SPACEX.App.prototype.start = function() {
	var self = this;

	var intro = true;
	self.zoom = INTRO_ZOOM_START;

	var mainLoop = function() {
		if(intro) {
			self.zoom *= 1.02;
			if(self.zoom >= INTRO_ZOOM_END) {
				intro = false;
			}
		}

		self.update();
		self.draw();
		requestAnimationFrame(mainLoop);
	};

	mainLoop();
};

SPACEX.App.prototype.update = function() {
	this.rotation = SPACEX.explorer.angle;
	this.offsetX = -SPACEX.explorer.x + this.width / 2 / this.zoom;
	this.offsetY = -SPACEX.explorer.y + this.height / 2 / this.zoom;

	SPACEX.GameObject.prototype.update.call(this);
};

SPACEX.App.prototype.drawImpl = function() {
	ctx.drawImage(this.img, 0, 0);
};
