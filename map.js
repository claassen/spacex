var SPACEX = SPACEX || {};

SPACEX.Map = function(x, y, zoom, width, height, windowWidth, windowHeight) {
	var offsetX = (windowWidth / 2) * (width / windowWidth / zoom) - windowWidth / 2;
	var offsetY = (windowHeight / 2) * (height / windowHeight / zoom) - windowHeight / 2;

	SPACEX.GameObject.call(this, {
		x: x,
		y: y,
		width: width,
		height: height,
		offsetX: offsetX,
		offsetY: offsetY,
		rotation: 0,
		zoom: zoom,
		isFixedPosition: true,
		isClipped: true
	});

	this.name = "Map";
};

SPACEX.Map.extends(SPACEX.GameObject);

// SPACEX.Map.prototype.zoomX = function(delta) {
// 	var xDelta = this.width / 2 / (this.zoom * delta) - this.width / 2 / this.zoom;
// 	var yDelta = this.height / 2 / (this.zoom * delta) - this.height / 2 / this.zoom;
//
// 	this.zoom *= delta;
//
// 	this.offsetX += xDelta;
// 	this.offsetY += yDelta;
// };

SPACEX.Map.prototype.move = function(x, y) {
	// this.offsetX -= x * Math.cos(this.rotation);
	// this.offsetY += x * Math.sin(this.rotation);
	//
	// this.offsetX -= y * Math.sin(this.rotation);
	// this.offsetY -= y * Math.cos(this.rotation);
};

SPACEX.Map.prototype.drawImpl = function() {
	clear(this.x, this.y, this.width, this.height);
	ctx.strokeStyle = "white";
	ctx.lineWidth = 1;
	ctx.strokeRect(this.x, this.y, this.width, this.height);
};

SPACEX.Map.prototype.update = function() {
	this.rotation = SPACEX.explorer.angle;
	this.offsetX = -SPACEX.explorer.x + this.width / 2 / this.zoom;
	this.offsetY = -SPACEX.explorer.y + this.height / 2 / this.zoom;
};
